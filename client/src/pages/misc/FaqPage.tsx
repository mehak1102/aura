import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Leaf,
  Mail,
  RotateCcw,
  Search,
  Truck,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Accordion } from '@components/content'
import { Body, Button, Display, Eyebrow, LeafShadows } from '@components/ui'
import {
  faqCategories,
  faqHero,
  type FaqCategoryIcon,
  type FaqCategoryId,
} from '@/data/faq'
import { contactInfo } from '@/data/stores'
import { useGsap, revealOnScroll } from '@animations/gsap'
import { scrollToSection } from '@/lib/lenisControl'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

const CATEGORY_ICONS: Record<FaqCategoryIcon, LucideIcon> = {
  truck: Truck,
  leaf: Leaf,
  rotate: RotateCcw,
  'credit-card': CreditCard,
}

function LeafRule() {
  return (
    <div
      data-page-reveal=""
      className="mt-5 flex max-w-[14rem] items-center gap-3"
      aria-hidden
    >
      <svg viewBox="0 0 28 26" className="h-4 w-4 text-soft-gold" fill="none">
        <path
          d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
          fill="currentColor"
        />
        <path
          d="M7.2 8.5C5.4 12.2 4.6 15.2 5.2 17.6a3.4 3.4 0 0 0 6.1 1.4C10.2 16.4 9.2 12.8 7.2 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
        <path
          d="M20.8 8.5C22.6 12.2 23.4 15.2 22.8 17.6a3.4 3.4 0 0 1-6.1 1.4C17.8 16.4 18.8 12.8 20.8 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
      </svg>
      <span className="h-px flex-1 bg-soft-gold/50" />
    </div>
  )
}

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query)
}

export default function FaqPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>(
    faqCategories[0].id,
  )

  const normalizedQuery = query.trim().toLowerCase()

  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return faqCategories

    return faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            matchesQuery(item.question, normalizedQuery) ||
            matchesQuery(item.answer, normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [normalizedQuery])

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-page-reveal]'))
  }, [visibleCategories.length, normalizedQuery])

  useEffect(() => {
    if (normalizedQuery || visibleCategories.length === 0) return

    const sections = visibleCategories
      .map((c) => document.getElementById(`faq-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]?.target
        if (top instanceof HTMLElement) {
          const id = top.id.replace(/^faq-/, '') as FaqCategoryId
          if (faqCategories.some((c) => c.id === id)) {
            setActiveCategory(id)
          }
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0.01 },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [visibleCategories, normalizedQuery])

  const jumpToCategory = (id: FaqCategoryId) => {
    setActiveCategory(id)
    const el = document.getElementById(`faq-${id}`)
    if (el) scrollToSection(el, -120)
  }

  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about Aura of Nature orders, shipping, returns, products, and payments."
      />
      <main
        ref={scope}
        className="relative isolate overflow-hidden bg-[#faf6ef]"
      >
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        {/* Hero */}
        <section className="relative pt-28 md:pt-32">
          <div className="container-aura pb-10 md:pb-12">
            <div className="max-w-2xl">
              <Eyebrow data-page-reveal="" tone="gold">
                {faqHero.eyebrow}
              </Eyebrow>
              <Display
                data-page-reveal=""
                as="h1"
                size="lg"
                className="mt-3 text-forest"
              >
                {faqHero.title}
              </Display>
              <LeafRule />
              <Body data-page-reveal="" muted className="mt-5 max-w-lg">
                {faqHero.description}
              </Body>

              <div data-page-reveal="" className="relative mt-8 max-w-md">
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-soft-gold"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions…"
                  aria-label="Search FAQ"
                  style={{ outline: 'none' }}
                  className="h-12 w-full rounded-full border border-charcoal/10 bg-white/70 pr-11 pl-11 text-[0.9rem] text-forest shadow-[0_10px_28px_rgba(23,55,40,0.05)] transition-colors placeholder:text-charcoal/40 focus:border-soft-gold/60"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-full p-1 text-charcoal/40 transition-colors hover:text-forest"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Browse */}
        <section className="relative pb-16 md:pb-20">
          <div className="container-aura">
            {/* Mobile category chips */}
            <div
              data-page-reveal=""
              className="mb-8 flex gap-2 overflow-x-auto pb-1 lg:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {faqCategories.map((category) => {
                const Icon = CATEGORY_ICONS[category.icon]
                const active = activeCategory === category.id
                const disabled =
                  normalizedQuery.length > 0 &&
                  !visibleCategories.some((c) => c.id === category.id)

                return (
                  <button
                    key={category.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => jumpToCategory(category.id)}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] tracking-[0.04em] transition-all',
                      active
                        ? 'bg-forest text-warm-white'
                        : 'bg-white/70 text-forest ring-1 ring-charcoal/10',
                      disabled && 'opacity-35',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {category.title}
                  </button>
                )
              })}
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-14">
              {/* Desktop sticky rail */}
              <aside
                data-page-reveal=""
                className="hidden lg:sticky lg:top-28 lg:block"
              >
                <p className="text-[0.68rem] font-medium tracking-[0.18em] text-[#b8975c] uppercase">
                  Browse
                </p>
                <nav className="mt-4 space-y-1" aria-label="FAQ categories">
                  {faqCategories.map((category) => {
                    const Icon = CATEGORY_ICONS[category.icon]
                    const active = activeCategory === category.id
                    const disabled =
                      normalizedQuery.length > 0 &&
                      !visibleCategories.some((c) => c.id === category.id)

                    return (
                      <button
                        key={category.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => jumpToCategory(category.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-300',
                          active
                            ? 'bg-forest text-warm-white shadow-[0_10px_24px_rgba(36,53,40,0.14)]'
                            : 'text-charcoal/75 hover:bg-white/70 hover:text-forest',
                          disabled && 'pointer-events-none opacity-35',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="leading-snug">{category.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </aside>

              <div className="min-w-0">
                {visibleCategories.length === 0 ? (
                  <div
                    data-page-reveal=""
                    className="rounded-2xl border border-charcoal/8 bg-white/55 px-6 py-12 text-center"
                  >
                    <Display as="h2" size="sm" className="text-forest">
                      No matching questions
                    </Display>
                    <Body muted className="mx-auto mt-3 max-w-sm">
                      Try a different search, or clear the filter to browse all
                      topics.
                    </Body>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-6 text-micro tracking-[0.14em] text-olive uppercase transition-colors hover:text-forest"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-12 md:space-y-14">
                    {visibleCategories.map((category, categoryIndex) => (
                      <div
                        key={category.id}
                        id={`faq-${category.id}`}
                        data-page-reveal=""
                        onFocusCapture={() => setActiveCategory(category.id)}
                      >
                        <h2 className="font-display text-2xl text-forest md:text-[1.65rem]">
                          {category.title}
                        </h2>
                        <div className="mt-5 border-t border-charcoal/10">
                          <Accordion
                            key={`${category.id}-${normalizedQuery}`}
                            variant="faq"
                            defaultOpen={
                              categoryIndex === 0 && !normalizedQuery ? 0 : null
                            }
                            items={category.items.map((item) => ({
                              title: item.question,
                              content: (
                                <Body
                                  muted
                                  size="sm"
                                  className="max-w-2xl leading-relaxed"
                                >
                                  {item.answer}
                                </Body>
                              ),
                            }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Still need help */}
        <section className="relative pb-20 md:pb-24">
          <div className="container-aura">
            <div
              data-page-reveal=""
              className="flex flex-col items-start justify-between gap-8 border-t border-soft-gold/30 pt-12 md:flex-row md:items-end md:gap-12"
            >
              <div className="max-w-lg">
                <Eyebrow tone="gold">Still need help?</Eyebrow>
                <Display as="h2" size="sm" className="mt-3 text-forest">
                  We are here for your ritual
                </Display>
                <Body muted className="mt-3 max-w-md">
                  Reach our team for order support, product advice, or anything
                  the FAQ does not cover — usually within one business day.
                </Body>
                <p className="mt-4 text-[0.82rem] text-charcoal/55">
                  <a
                    href={`mailto:${contactInfo.support}`}
                    className="inline-flex items-center gap-2 text-forest transition-colors hover:text-olive"
                  >
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {contactInfo.support}
                  </a>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate(ROUTES.contact)}>
                  Contact us
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.shipping)}
                >
                  Shipping policy
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

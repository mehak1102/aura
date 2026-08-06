import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock3,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Button, Display, Eyebrow, LeafShadows } from '@components/ui'
import { shippingPolicy } from '@/data/legal'
import { contactInfo } from '@/data/stores'
import { useGsap, revealOnScroll } from '@animations/gsap'
import { scrollToSection } from '@/lib/lenisControl'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'
import { useFreeShippingThreshold } from '@hooks/usePublicSettings'
import { FLAT_SHIPPING_FEE } from '@utils/orders'

const SECTION_ICONS: Record<string, LucideIcon> = {
  'delivery-times': Clock3,
  'shipping-costs': IndianRupee,
  'order-processing': Package,
  tracking: MapPin,
  'delivery-issues': Truck,
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

function sectionId(heading: string, id?: string) {
  return id ?? heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function splitListItem(item: string) {
  const idx = item.indexOf(':')
  if (idx === -1) return { label: item, value: '' }
  return {
    label: item.slice(0, idx).trim(),
    value: item.slice(idx + 1).trim(),
  }
}

export default function ShippingPolicyPage() {
  const navigate = useNavigate()
  const freeShippingThreshold = useFreeShippingThreshold()
  const costHighlights = [
    {
      label: `Orders above ₹${freeShippingThreshold}`,
      value: 'Free',
      detail: 'Standard shipping',
    },
    {
      label: `Orders below ₹${freeShippingThreshold}`,
      value: `₹${FLAT_SHIPPING_FEE}`,
      detail: 'Flat fee',
    },
  ]
  const sections = shippingPolicy.sections
  const [activeSection, setActiveSection] = useState(
    sectionId(sections[0].heading, sections[0].id),
  )

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-page-reveal]'))
  }, [])

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(`policy-${sectionId(s.heading, s.id)}`))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]?.target
        if (top instanceof HTMLElement) {
          setActiveSection(top.id.replace(/^policy-/, ''))
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0.01 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const jumpTo = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(`policy-${id}`)
    if (el) scrollToSection(el, -120)
  }

  return (
    <>
      <Seo
        title="Shipping Policy"
        description="Delivery times, shipping costs, and tracking for Aura of Nature orders across India."
      />
      <main
        ref={scope}
        className="relative isolate overflow-hidden bg-[#faf6ef]"
      >
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <section className="relative pt-28 md:pt-32">
          <div className="container-aura pb-10 md:pb-12">
            <div className="max-w-2xl">
              <Eyebrow data-page-reveal="" tone="gold">
                Legal
              </Eyebrow>
              <Display
                data-page-reveal=""
                as="h1"
                size="lg"
                className="mt-3 text-forest"
              >
                {shippingPolicy.title}
              </Display>
              <LeafRule />
              <p
                data-page-reveal=""
                className="mt-4 text-[0.78rem] tracking-[0.06em] text-charcoal/45"
              >
                Last updated {shippingPolicy.lastUpdated}
              </p>
              <Body data-page-reveal="" muted className="mt-5 max-w-lg">
                {shippingPolicy.intro}
              </Body>
            </div>
          </div>
        </section>

        <section className="relative pb-16 md:pb-20">
          <div className="container-aura">
            <div
              data-page-reveal=""
              className="mb-8 flex gap-2 overflow-x-auto pb-1 lg:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {sections.map((section) => {
                const id = sectionId(section.heading, section.id)
                const Icon = SECTION_ICONS[id] ?? Package
                const active = activeSection === id

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => jumpTo(id)}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] tracking-[0.04em] transition-all',
                      active
                        ? 'bg-forest text-warm-white'
                        : 'bg-white/70 text-forest ring-1 ring-charcoal/10',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {section.heading}
                  </button>
                )
              })}
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-14">
              <aside
                data-page-reveal=""
                className="hidden lg:sticky lg:top-28 lg:block"
              >
                <p className="text-[0.68rem] font-medium tracking-[0.18em] text-[#b8975c] uppercase">
                  On this page
                </p>
                <nav className="mt-4 space-y-1" aria-label="Policy sections">
                  {sections.map((section) => {
                    const id = sectionId(section.heading, section.id)
                    const Icon = SECTION_ICONS[id] ?? Package
                    const active = activeSection === id

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => jumpTo(id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-300',
                          active
                            ? 'bg-forest text-warm-white shadow-[0_10px_24px_rgba(36,53,40,0.14)]'
                            : 'text-charcoal/75 hover:bg-white/70 hover:text-forest',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="leading-snug">{section.heading}</span>
                      </button>
                    )
                  })}
                </nav>
              </aside>

              <div className="min-w-0 space-y-12 md:space-y-14">
                {sections.map((section) => {
                  const id = sectionId(section.heading, section.id)
                  const isDelivery = id === 'delivery-times'
                  const isCosts = id === 'shipping-costs'

                  return (
                    <article
                      key={id}
                      id={`policy-${id}`}
                      data-page-reveal=""
                    >
                      <h2 className="font-display text-2xl text-forest md:text-[1.65rem]">
                        {section.heading}
                      </h2>

                      <div className="mt-4 space-y-4">
                        {section.paragraphs.map((p) => (
                          <Body
                            key={p.slice(0, 48)}
                            muted
                            className="max-w-2xl leading-relaxed"
                          >
                            {p}
                          </Body>
                        ))}
                      </div>

                      {isDelivery && section.list && (
                        <ul className="mt-6 divide-y divide-charcoal/8 border-y border-charcoal/8">
                          {section.list.map((item) => {
                            const { label, value } = splitListItem(item)
                            return (
                              <li
                                key={item}
                                className="flex items-baseline justify-between gap-6 py-3.5"
                              >
                                <span className="text-[0.92rem] text-forest">
                                  {label}
                                </span>
                                <span className="shrink-0 text-[0.88rem] font-medium tracking-[0.02em] text-olive">
                                  {value}
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      )}

                      {isCosts && (
                        <div className="mt-6 grid gap-0 border-y border-charcoal/8 sm:grid-cols-3">
                          {costHighlights.map((row, i) => (
                            <div
                              key={row.label}
                              className={cn(
                                'py-5 sm:px-5',
                                i > 0 &&
                                  'border-t border-charcoal/8 sm:border-t-0 sm:border-l',
                                i === 0 && 'sm:pl-0',
                                i === costHighlights.length - 1 && 'sm:pr-0',
                              )}
                            >
                              <p className="text-[0.72rem] tracking-[0.12em] text-charcoal/45 uppercase">
                                {row.label}
                              </p>
                              <p className="mt-2 font-display text-2xl text-forest">
                                {row.value}
                              </p>
                              <p className="mt-1 text-[0.78rem] text-charcoal/55">
                                {row.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isDelivery && section.list && (
                        <ul className="mt-5 space-y-2.5">
                          {section.list.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-body font-light text-charcoal-muted"
                            >
                              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-soft-gold" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative pb-20 md:pb-24">
          <div className="container-aura">
            <div
              data-page-reveal=""
              className="flex flex-col items-start justify-between gap-8 border-t border-soft-gold/30 pt-12 md:flex-row md:items-end md:gap-12"
            >
              <div className="max-w-lg">
                <Eyebrow tone="gold">Need help with an order?</Eyebrow>
                <Display as="h2" size="sm" className="mt-3 text-forest">
                  Questions about delivery
                </Display>
                <Body muted className="mt-3 max-w-md">
                  Check the FAQ for common shipping answers, or write to our
                  support team if your parcel needs attention.
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
                <Button onClick={() => navigate(ROUTES.faq)}>View FAQ</Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.contact)}
                >
                  Contact us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

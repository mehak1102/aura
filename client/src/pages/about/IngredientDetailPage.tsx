import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useRef } from 'react'
import { Seo } from '@components/seo/Seo'
import {
  BackButton,
  Body,
  Display,
  Eyebrow,
  LeafShadows,
  Button,
} from '@components/ui'
import { ProductCard } from '@components/shop/ProductCard'
import { useCatalog } from '@contexts/CatalogContext'
import {
  botanicals,
  getBotanicalBySlug,
  botanicalPath,
  type Botanical,
} from '@/data/botanicals'
import { ROUTES } from '@/routes/paths'
import type { CatalogProduct } from '@/types/shop'
import {
  useGsap,
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  revealCommerceBlocks,
  maskRevealImages,
  revealOnScroll,
} from '@animations/gsap'

const CATEGORY_LABEL: Record<string, string> = {
  'skin-care': 'Face Care',
  'body-care': 'Body Care',
  'hair-care': 'Hair Care',
  'essential-oils': 'Essential Oils',
  'cold-pressed-oils': 'Cold Pressed Oils',
}

const DEFAULT_FEATURES = [
  { label: 'Plant-Powered', detail: 'Honest botanicals' },
  { label: 'Handcrafted Care', detail: 'Small-batch ritual' },
  { label: 'Clean Formula', detail: 'No harsh fillers' },
  { label: 'For Daily Rituals', detail: 'Skin, body & hair' },
]

function LeafMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 26"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z" />
    </svg>
  )
}

function BenefitIcon({ index }: { index: number }) {
  const common = {
    viewBox: '0 0 32 32',
    className: 'h-5 w-5',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  switch (index % 5) {
    case 0:
      return (
        <svg {...common}>
          <path d="M16 6c4 5 6 10 6 14a6 6 0 0 1-12 0c0-4 2-9 6-14Z" />
          <path d="M16 12v12" />
        </svg>
      )
    case 1:
      return (
        <svg {...common}>
          <path d="M16 26V8" />
          <path d="M16 12c-4 1-7 4-8 8M16 12c4 1 7 4 8 8" />
        </svg>
      )
    case 2:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="7" />
          <path d="M16 9v14M9 16h14" />
        </svg>
      )
    case 3:
      return (
        <svg {...common}>
          <path d="M8 20c0-4 3.5-8 8-8s8 4 8 8" />
          <path d="M16 8v4" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M16 6c-2 4-3.5 8-3.5 11a3.5 3.5 0 0 0 7 0c0-3-1.5-7-3.5-11Z" />
        </svg>
      )
  }
}

function FeatureIcon({ index }: { index: number }) {
  const common = {
    viewBox: '0 0 32 32',
    className: 'h-5 w-5',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  switch (index % 4) {
    case 0:
      return (
        <svg {...common}>
          <path d="M10 22c2-8 4-14 6-16 2 2 4 8 6 16" />
          <path d="M12 18h8" />
        </svg>
      )
    case 1:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="8" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      )
    case 2:
      return (
        <svg {...common}>
          <path d="M16 7c4 5 6 10 6 14a6 6 0 0 1-12 0c0-4 2-9 6-14Z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M8 16h16M16 8v16" />
          <circle cx="16" cy="16" r="9" />
        </svg>
      )
  }
}

function splitBenefit(text: string) {
  const words = text.split(' ')
  if (words.length <= 3) return { title: text, detail: '' }
  const mid = Math.min(3, Math.ceil(words.length / 2))
  return {
    title: words.slice(0, mid).join(' '),
    detail: words.slice(mid).join(' '),
  }
}

function resolveDetail(botanical: Botanical, related: CatalogProduct[]) {
  const tagline =
    botanical.tagline ??
    `A purposeful botanical for modern rituals`

  const usedIn =
    botanical.usedIn ??
    Array.from(
      new Set(
        related.map(
          (p) => CATEGORY_LABEL[p.category] ?? p.category.replace(/-/g, ' '),
        ),
      ),
    ).slice(0, 4)

  const features = botanical.features ?? DEFAULT_FEATURES

  return { tagline, usedIn, features }
}

export default function IngredientDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const botanical = getBotanicalBySlug(slug)
  const { products } = useCatalog()
  const carouselRef = useRef<HTMLDivElement>(null)

  const related = useMemo(() => {
    if (!botanical) return [] as CatalogProduct[]
    const bySlug = botanical.productSlugs
      .map((s) => products.find((p) => p.slug === s))
      .filter(Boolean) as CatalogProduct[]
    const byMatch = products.filter((p) =>
      p.ingredients.some((ing) =>
        botanical.matchTerms.some((term) =>
          ing.toLowerCase().includes(term.toLowerCase()),
        ),
      ),
    )
    const map = new Map<string, CatalogProduct>()
    ;[...bySlug, ...byMatch].forEach((p) => map.set(p.id, p))
    return Array.from(map.values())
  }, [botanical, products])

  const moreBotanicals = useMemo(() => {
    if (!botanical) return []
    return botanicals.filter((b) => b.slug !== botanical.slug).slice(0, 6)
  }, [botanical])

  const detail = botanical ? resolveDetail(botanical, related) : null

  const scrollCarousel = (dir: -1 | 1) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.75), behavior: 'smooth' })
  }

  const scope = useGsap(() => {
    const root = scope.current
    if (!root) return

    revealOnScroll(root.querySelectorAll('[data-page-reveal]'))
    maskRevealImages(root)
    revealCommerceBlocks(root)

    if (prefersReducedMotion()) return

    const benefitItems = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-benefit-item]'),
    )
    if (benefitItems.length) {
      gsap.set(benefitItems, { autoAlpha: 0, y: 20 })
      gsap.to(benefitItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.querySelector('[data-benefits-list]') ?? benefitItems[0],
          start: 'top 90%',
          once: true,
        },
      })
    }

    const productCards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-formulas-grid] [data-product-card]'),
    )
    if (productCards.length) {
      gsap.set(productCards, { autoAlpha: 0, y: 40, scale: 0.97 })
      gsap.to(productCards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.querySelector('[data-formulas-grid]') ?? productCards[0],
          start: 'top 88%',
          once: true,
        },
      })
    }

    const exploreTiles = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-explore-tile]'),
    )
    if (exploreTiles.length) {
      gsap.set(exploreTiles, { autoAlpha: 0, y: 36 })
      gsap.to(exploreTiles, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.querySelector('[data-explore-grid]') ?? exploreTiles[0],
          start: 'top 90%',
          once: true,
        },
      })
    }

    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [slug])

  if (!botanical || !detail) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf6ef] px-6 pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          Ingredient not found
        </Display>
        <Button
          className="mt-8"
          onClick={() => navigate(ROUTES.ingredients)}
        >
          All ingredients
        </Button>
      </main>
    )
  }

  const benefitRows = botanical.benefits.slice(0, 5)

  return (
    <>
      <Seo title={botanical.name} description={botanical.howItWorks} />
      <main
        ref={scope}
        className="relative overflow-hidden bg-[#faf6ef] pb-24"
      >
        <LeafShadows />

        <div className="relative z-[1]">
          {/* Hero */}
          <section className="pt-24 md:pt-28">
            <div className="container-aura">
              <BackButton
                to={ROUTES.ingredients}
                label="Back to ingredients"
                className="mb-6 md:mb-8"
              />

              <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                <div
                  data-reveal-image=""
                  className="relative h-full min-h-[24rem] overflow-hidden sm:min-h-[28rem]"
                >
                  <img
                    src={botanical.image}
                    alt={botanical.name}
                    className="absolute inset-0 h-full w-full object-cover object-[95%_center] [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_12%)] lg:[mask-image:linear-gradient(to_left,transparent_0%,black_26%)] lg:[-webkit-mask-image:linear-gradient(to_left,transparent_0%,black_26%)]"
                    loading="eager"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#faf6ef] via-[#faf6ef]/45 to-transparent lg:hidden"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-[32%] bg-gradient-to-l from-[#faf6ef] via-[#faf6ef]/45 to-transparent lg:block"
                  />
                </div>

                <div className="relative z-10 flex min-w-0 flex-col">
                  <Eyebrow data-page-reveal="" tone="gold">
                    {botanical.latin}
                  </Eyebrow>
                  <Display
                    data-page-reveal=""
                    as="h1"
                    size="lg"
                    className="mt-2 text-forest"
                  >
                    {botanical.name}
                  </Display>

                  <div
                    data-page-reveal=""
                    className="mt-3 flex items-center gap-2 text-soft-gold"
                  >
                    <LeafMark className="h-3.5 w-3.5" />
                    <p className="font-display text-lg italic text-forest/80 md:text-xl">
                      {detail.tagline}
                    </p>
                  </div>

                  <Body
                    data-page-reveal=""
                    muted
                    className="mt-5 max-w-xl leading-relaxed"
                  >
                    {botanical.howItWorks}
                  </Body>

                  <div
                    data-page-reveal=""
                    className="mt-8 grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_15.5rem] xl:gap-8"
                  >
                    <ul data-benefits-list="" className="min-w-0 space-y-2.5">
                      {benefitRows.map((benefit, i) => {
                        const { title, detail } = splitBenefit(benefit)
                        return (
                          <li
                            key={benefit}
                            data-benefit-item=""
                            className="flex items-center gap-2.5"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-soft-gold/40 text-soft-gold">
                              <BenefitIcon index={i} />
                            </span>
                            <span className="min-w-0 leading-snug">
                              <span className="font-medium text-forest">
                                {title}
                              </span>
                              {detail ? (
                                <span className="text-sm font-light text-charcoal/65">
                                  {' '}
                                  {detail}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    <aside
                      data-page-reveal=""
                      className="relative z-0 w-full max-w-[15.5rem] justify-self-start rounded-2xl bg-[#f3ebe0] p-6 shadow-[0_16px_40px_rgba(36,53,40,0.08)] xl:justify-self-end"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-forest">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          aria-hidden
                        >
                          <path d="M9 3h6v3H9zM8 6h8l1 14H7L8 6z" />
                          <path d="M10 10v6M14 10v6" />
                        </svg>
                      </div>
                      <p className="mt-4 text-micro tracking-[0.18em] text-charcoal/55 uppercase">
                        Used in
                      </p>
                      <p className="mt-1 font-display text-3xl text-forest">
                        {related.length || botanical.productSlugs.length}{' '}
                        <span className="text-xl">Products</span>
                      </p>
                      {detail.usedIn.length > 0 && (
                        <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/70">
                          {detail.usedIn.slice(0, 2).join(' · ')}
                          {detail.usedIn.length > 2 ? (
                            <>
                              <br />
                              {detail.usedIn.slice(2, 4).join(' · ')}
                            </>
                          ) : null}
                        </p>
                      )}
                      <a
                        href="#formulas"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-micro tracking-[0.16em] !text-white uppercase transition-colors hover:bg-forest-deep"
                      >
                        View Products
                        <span aria-hidden>→</span>
                      </a>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Formulas carousel */}
          <section
            id="formulas"
            data-block-reveal=""
            className="section-aura-sm scroll-mt-28"
          >
            <div className="container-aura">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow tone="gold">In our formulas</Eyebrow>
                  <Display as="h2" size="md" className="mt-2 text-forest">
                    Products using {botanical.name}
                  </Display>
                  <div className="mt-3 flex items-center gap-3 text-soft-gold" aria-hidden>
                    <span className="h-px w-10 bg-soft-gold/50" />
                    <LeafMark className="h-3.5 w-3.5" />
                    <span className="h-px w-10 bg-soft-gold/50" />
                  </div>
                </div>

                {related.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => scrollCarousel(-1)}
                      aria-label="Previous products"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-forest transition-colors hover:border-forest hover:bg-warm-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 6l-6 6 6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel(1)}
                      aria-label="Next products"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-forest transition-colors hover:border-forest hover:bg-warm-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {related.length > 0 ? (
                <div
                  ref={carouselRef}
                  data-formulas-grid=""
                  className="mt-10 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {related.map((product) => (
                    <div
                      key={product.id}
                      className="w-[min(100%,18rem)] shrink-0 sm:w-[17.5rem]"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 max-w-lg">
                  <Body muted>
                    Explore the full shop while we expand this botanical’s
                    shelf.
                  </Body>
                  <Link
                    to={ROUTES.shop}
                    className="mt-5 inline-flex text-micro tracking-[0.18em] text-forest uppercase underline-offset-4 hover:underline"
                  >
                    Visit the shop
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Feature bar */}
          <section data-block-reveal="" className="pb-6 md:pb-8">
            <div className="container-aura">
              <div className="grid gap-6 rounded-2xl border border-charcoal/10 bg-[#f7f1e6]/80 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-2 lg:py-8">
                {detail.features.map((feature, i) => (
                  <div
                    key={feature.label}
                    className={`flex items-center gap-3 px-3 lg:justify-center lg:px-5 ${
                      i > 0 ? 'lg:border-l lg:border-charcoal/10' : ''
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-soft-gold/35 text-soft-gold">
                      <FeatureIcon index={i} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-forest">
                        {feature.label}
                      </span>
                      <span className="mt-0.5 block text-xs font-light text-charcoal/60">
                        {feature.detail}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Explore other ingredients */}
          <section data-block-reveal="" className="pb-[var(--spacing-section-sm)] pt-2 md:pt-4">
            <div className="container-aura">
              <div className="flex items-center gap-3">
                <Eyebrow tone="gold" className="!tracking-[0.2em]">
                  Explore other ingredients
                </Eyebrow>
                <LeafMark className="h-3.5 w-3.5 text-soft-gold" />
              </div>

              <div
                data-explore-grid=""
                className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6 lg:gap-5 [&::-webkit-scrollbar]:hidden"
              >
                {moreBotanicals.map((b) => (
                  <Link
                    key={b.slug}
                    to={botanicalPath(b.slug)}
                    data-explore-tile=""
                    className="group relative min-w-[9.5rem] flex-[0_0_42%] overflow-hidden rounded-2xl sm:min-w-0 sm:flex-none"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-[#ebe3d6]">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="h-full w-full origin-[78%_52%] scale-[1.28] object-cover object-[78%_52%] transition-transform duration-700 group-hover:scale-[1.35]"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                      <span className="font-display text-base leading-tight text-warm-white">
                        {b.name}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-white/95 text-forest transition-transform duration-400 group-hover:translate-x-0.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { PRODUCTS } from '@/data/products'
import { ingredientShowcaseItems } from '@/data/home'
import { productImageUrl } from '@utils/productImage'
import { cn } from '@utils/index'
import 'swiper/css'

const BotanicalStamp = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent',
      className,
    )}
    aria-hidden
  >
    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
      <defs>
        <path id="stamp-top" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="stamp-bottom" d="M 170 100 A 70 70 0 0 1 30 100" />
      </defs>

      <text
        fill="#4A4D43"
        fontSize="11"
        fontWeight="500"
        letterSpacing="3.4"
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
      >
        <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
          PURE BOTANICAL
        </textPath>
      </text>

      <text
        fill="#4A4D43"
        fontSize="11"
        fontWeight="500"
        letterSpacing="2.6"
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
      >
        <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
          THERAPEUTIC GRADE
        </textPath>
      </text>

      <circle cx="30" cy="100" r="2" fill="#4A4D43" />
      <circle cx="170" cy="100" r="2" fill="#4A4D43" />

      {/* Three-leaf sprig — matches stamp reference */}
      <g
        transform="translate(100 106)"
        stroke="#4A4D43"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M0 22 V-2" />
        {/* left leaf */}
        <path d="M0 2 C-9 -2 -18 -10 -20 -18 C-12 -16 -4 -8 0 2" />
        <path d="M0 2 L-12 -10" />
        {/* right leaf */}
        <path d="M0 2 C9 -2 18 -10 20 -18 C12 -16 4 -8 0 2" />
        <path d="M0 2 L12 -10" />
        {/* top leaf */}
        <path d="M0 -2 C-6 -12 -4 -26 0 -30 C4 -26 6 -12 0 -2" />
        <path d="M0 -2 V-26" />
      </g>
    </svg>
  </div>
)

const AUTO_MS = 3200
const FADE_MS = 900
const PRODUCT_AUTO_MS = AUTO_MS

const productSlugByIngredientId: Record<string, string> = {
  charcoal: 'activated-charcoal-soap',
  'black-cumin': 'black-cumin-cold-pressed-oil',
  'carrot-seed': 'carrot-seed-essential-oil',
  coffee: 'fresh-coffee-face-wash',
  'cucumber-seed': 'cucumber-seed-cold-pressed-oil',
  eucalyptus: 'eucalyptus-essential-oil',
  'goat-milk': 'goat-milk-soap',
  jojoba: 'jojoba-cold-pressed-oil',
  lavender: 'lavender-essential-oil',
  peach: 'nourishing-peach-lotion-kumkumadi-oil',
  'tea-tree': 'tea-tree-essential-oil',
  watermelon: 'watermelon-seed-cold-pressed-oil',
  'wild-apricot': 'wild-apricot-cold-pressed-oil',
}

const themeClasses: Record<string, { glow: string }> = {
  'tea-tree': { glow: 'bg-[#95a773]/20' },
  lavender: { glow: 'bg-[#a08fc7]/18' },
  charcoal: { glow: 'bg-[#798273]/18' },
  watermelon: { glow: 'bg-[#c58b78]/16' },
  jojoba: { glow: 'bg-[#9da66e]/16' },
  'goat-milk': { glow: 'bg-[#c8b48b]/16' },
  coffee: { glow: 'bg-[#8b6b4a]/16' },
  peach: { glow: 'bg-[#d4a574]/16' },
  eucalyptus: { glow: 'bg-[#7a9a6a]/18' },
  'carrot-seed': { glow: 'bg-[#c9854a]/16' },
  'wild-apricot': { glow: 'bg-[#d4a05a]/16' },
  'black-cumin': { glow: 'bg-[#6b6358]/16' },
  'cucumber-seed': { glow: 'bg-[#7ea06a]/18' },
}

const showcaseHeroImages: Record<string, string> = {
  charcoal: '/ingredients-showcase/01-charcoal.png',
  'black-cumin': '/ingredients-showcase/02-black-cumin.png',
  'carrot-seed': '/ingredients-showcase/03-carrot-seed.png',
  coffee: '/ingredients-showcase/04-coffee.png',
  'cucumber-seed': '/ingredients-showcase/05-cucumber-seed.png',
  eucalyptus: '/ingredients-showcase/06-eucalyptus.png',
  'goat-milk': '/ingredients-showcase/07-goat-milk.png',
  jojoba: '/ingredients-showcase/08-jojoba.png',
  lavender: '/ingredients-showcase/09-lavender.png',
  peach: '/ingredients-showcase/10-peach.png',
  'tea-tree': '/ingredients-showcase/11-tea-tree.png',
  watermelon: '/ingredients-showcase/12-watermelon.png',
  'wild-apricot': '/ingredients-showcase/13-wild-apricot.png',
}

export function HomeIngredients() {
  const [activeIndex, setActiveIndex] = useState(0)
  const navScrollRef = useRef<HTMLDivElement | null>(null)
  const productSwiperRef = useRef<SwiperInstance | null>(null)
  const syncingFromNavRef = useRef(false)
  const active = ingredientShowcaseItems[activeIndex]
  const theme = themeClasses[active.theme] ?? { glow: 'bg-[#95a773]/20' }

  // Products ordered to match Meet the Plants slides
  const allProducts = useMemo(
    () =>
      ingredientShowcaseItems
        .map((item) => {
          const slug = productSlugByIngredientId[item.id]
          const product = PRODUCTS.find((p) => p.slug === slug)
          if (!product) return null
          return {
            id: product.id,
            slug: product.slug,
            name: product.title,
            image: product.images[0]?.url ?? '',
            price: product.mrp,
            ingredientId: item.id,
            to: `/product/${product.slug}`,
          }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [],
  )

  const goToIngredient = (index: number) => {
    const next = (index + ingredientShowcaseItems.length) % ingredientShowcaseItems.length
    setActiveIndex(next)
    const swiper = productSwiperRef.current
    if (!swiper) return
    syncingFromNavRef.current = true
    swiper.slideToLoop(next, 600)
    window.setTimeout(() => {
      syncingFromNavRef.current = false
    }, 650)
  }

  const setIndex = (next: number) => {
    goToIngredient(next)
  }

  useEffect(() => {
    Object.values(showcaseHeroImages).forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const container = navScrollRef.current
    if (!container) return
    const activeEl = container.querySelector<HTMLElement>(
      `[data-nav-item="${ingredientShowcaseItems[activeIndex]?.id}"]`,
    )
    if (!activeEl) return
    const left = activeEl.offsetLeft - (container.clientWidth - activeEl.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeIndex])

  return (
    <section className="relative overflow-hidden bg-[#F3EBDD]">
      {/* One continuous full-bleed plane — no contain seam */}
      <div className="relative min-h-[64svh] w-full lg:min-h-[68svh]">
        {/* Stacked slides — feathered bottom edge (soft merge) */}
        <div className="absolute inset-0 bg-[#F3EBDD]">
          {ingredientShowcaseItems.map((item, index) => {
            const src = showcaseHeroImages[item.id] ?? item.heroImage
            const isActive = index === activeIndex
            return (
              <div
                key={item.id}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 bg-[#F3EBDD] bg-right bg-no-repeat transition-opacity ease-in-out',
                  isActive ? 'z-[1] opacity-100' : 'z-0 opacity-0',
                )}
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: 'right center',
                  backgroundSize: 'cover',
                  transitionDuration: `${FADE_MS}ms`,
                  // Soft merge: photo feathers left + bottom into cream (no hard cut)
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 48%, #000 100%), linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.15) 88%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 48%, #000 100%), linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.15) 88%, transparent 100%)',
                  maskComposite: 'intersect',
                }}
              />
            )
          })}
        </div>

        {/* Soft washes — reinforce the feather into cream */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,235,221,0.88)_0%,rgba(243,235,221,0.45)_24%,rgba(243,235,221,0.12)_48%,rgba(243,235,221,0)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,#F3EBDD_0%,rgba(243,235,221,0.85)_28%,rgba(243,235,221,0.35)_62%,rgba(243,235,221,0)_100%)] lg:h-56" />
          <div
            className={cn(
              'absolute -right-6 top-10 h-72 w-72 rounded-full blur-3xl transition-colors ease-in-out',
              theme.glow,
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
        </div>

        <BotanicalStamp className="pointer-events-none absolute top-4 right-4 z-20 hidden h-[7.5rem] w-[7.5rem] lg:block xl:top-5 xl:right-5 xl:h-[8.5rem] xl:w-[8.5rem]" />

        <div className="relative z-10 mx-auto flex min-h-[64svh] w-full max-w-[1760px] flex-col px-5 sm:px-8 lg:min-h-[68svh] lg:px-12">
          <div className="mx-auto max-w-3xl pt-6 text-center lg:pt-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-[#6f6558]">
              SHOP BY INGREDIENT
            </p>
            <h2 className="mt-1.5 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.03em] text-[#243528]">
              Meet the plants
            </h2>
            <p className="mx-auto mt-1.5 max-w-xl text-[0.9rem] leading-6 text-[#625d56]">
              Each formula begins with a single potent botanical
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
            <div className="relative z-10 flex items-start gap-5 py-4 lg:gap-6 lg:py-5">
              <div className="mt-5 inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#dfd2bd]/55 bg-[#F3EBDD]/90 text-[#5f6f53] sm:mt-6 sm:h-[5.5rem] sm:w-[5.5rem]">
                <Leaf className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-[0.95rem] font-medium uppercase tracking-[0.24em] text-[#746759] sm:text-[1.05rem]">
                  {active.indexLabel}
                </p>
                <h3 className="mt-2 font-display text-[clamp(2.5rem,3.8vw,3.4rem)] leading-[0.95] text-[#243528]">
                  {active.name}
                </h3>
                <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#B8955E] sm:text-[0.84rem]">
                  {active.benefits.join(' • ')}
                </p>
                <p className="mt-3 max-w-md text-[1.05rem] leading-7 text-[#4f4a44] sm:text-[1.1rem]">
                  {active.description}
                </p>

                <Link
                  to={active.to}
                  className="group mt-5 inline-flex h-12 w-[17.5rem] shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-[#D4C4A0] bg-[#243528] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] shadow-[0_12px_28px_rgba(36,53,40,0.18)] transition hover:-translate-y-0.5 hover:border-[#E8D9B8]"
                  style={{ color: '#E8D9B8' }}
                >
                  <span className="truncate" style={{ color: '#E8D9B8' }}>
                    Explore {active.name}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: '#E8D9B8' }}
                    stroke="currentColor"
                  />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute bottom-8 right-0 z-10 inline-flex items-center gap-2.5 rounded-full border border-[#D4C4A0] bg-[#F3EBDD]/85 px-4 py-2.5 backdrop-blur-sm">
                <Leaf className="h-3.5 w-3.5 shrink-0 text-[#5B5E45]" strokeWidth={1.75} />
                <div className="flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.04em] text-[#5B5E45]">
                  {active.badges.map((badge, index) => (
                    <span key={badge} className="flex items-center gap-2">
                      {index > 0 ? <span className="h-1 w-1 rounded-full bg-[#C5A059]" /> : null}
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient nav — open strip floating on soft-merged cream */}
          <div className="relative z-20 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIndex(activeIndex - 1)}
                aria-label="Previous ingredient"
                className="hidden h-9 w-9 shrink-0 items-center justify-center text-[#C8A96A] transition hover:text-[#243528] md:inline-flex"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div
                ref={navScrollRef}
                className="flex min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {ingredientShowcaseItems.map((item, index) => {
                  const isActive = activeIndex === index
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-nav-item={item.id}
                      onClick={() => goToIngredient(index)}
                      className={cn(
                        'relative flex min-w-[14.5rem] snap-start items-center gap-3 px-3.5 py-3 text-left transition duration-300 sm:min-w-[15.5rem]',
                        index > 0 &&
                          'before:absolute before:left-0 before:top-1/2 before:h-9 before:w-px before:-translate-y-1/2 before:bg-[#C8A96A]/35',
                      )}
                    >
                      <div
                        className={cn(
                          'h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#E8DCC8]',
                          isActive
                            ? 'ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#F3EBDD]'
                            : 'ring-1 ring-[#C8A96A]/25',
                        )}
                      >
                        <img
                          src={showcaseHeroImages[item.id] ?? item.navImage}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-right"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            'font-display text-[1.1rem] leading-none',
                            isActive ? 'text-[#2f4a36]' : 'text-[#243528]',
                          )}
                        >
                          {item.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[0.72rem] leading-4 text-[#6f6558]">
                          {item.navBenefit}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setIndex(activeIndex + 1)}
                aria-label="Next ingredient"
                className="hidden h-9 w-9 shrink-0 items-center justify-center text-[#C8A96A] transition hover:text-[#243528] md:inline-flex"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Best sellers — continuous cream, no seam */}
      <div className="relative z-10">
        <div className="mx-auto w-full max-w-[1760px] px-5 pb-5 pt-3 sm:px-8 lg:px-12 lg:pb-6">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
                Shop the formulas
              </p>
              <h3 className="mt-1 font-display text-[clamp(1.15rem,1.8vw,1.45rem)] leading-none tracking-[-0.02em] text-[#243528]">
                Used in our Best Sellers
              </h3>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#243528]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#243528] text-[#F8F3EA]">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              View All Products
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

            <div className="overflow-hidden rounded-[1.25rem] border border-[#C8A96A]/80 bg-transparent py-1.5 sm:py-2">
              <Swiper
                modules={[Autoplay]}
                loop
                slidesPerView="auto"
                spaceBetween={0}
                speed={700}
                allowTouchMove
                grabCursor
                centeredSlides={false}
                autoplay={{
                  delay: PRODUCT_AUTO_MS,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSwiper={(swiper) => {
                  productSwiperRef.current = swiper
                }}
                onSlideChange={(swiper) => {
                  if (syncingFromNavRef.current) return
                  setActiveIndex(swiper.realIndex)
                }}
                className="bestsellers-luxury [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {allProducts.map((product, index) => {
                  const isActive = index === activeIndex
                  return (
                    <SwiperSlide
                      key={product.id}
                      className="!w-[235px] sm:!w-[255px] lg:!w-[265px]"
                    >
                      <Link
                        to={product.to}
                        onMouseEnter={() => {
                          if (index !== activeIndex) setActiveIndex(index)
                        }}
                        className={cn(
                          'group relative flex h-full min-h-[110px] items-center gap-3.5 border-r border-[#C8A96A]/40 px-3.5 py-3.5 text-left transition duration-500 hover:-translate-y-0.5 sm:min-h-[116px] sm:py-4',
                          isActive && 'bg-[#C8A96A]/18',
                        )}
                      >
                        {/* Product image — left */}
                        <div
                          className={cn(
                            'relative z-[1] flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8DCC8] sm:h-[4.5rem] sm:w-[4.5rem]',
                            isActive && 'ring-2 ring-[#C8A96A] ring-offset-2 ring-offset-[#E4D6C6]',
                          )}
                        >
                          <img
                            src={productImageUrl(product.image, 'card')}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain p-1.5 mix-blend-multiply transition duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Text — right */}
                        <div className="relative z-[1] min-w-0 flex-1">
                          <p className="line-clamp-2 font-display text-[1.05rem] leading-snug text-[#243528] sm:text-[1.1rem]">
                            {product.name}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <p className="text-[0.8rem] font-medium tracking-[0.04em] text-[#A8894E]">
                              ₹{product.price}
                            </p>
                            <span
                              className={cn(
                                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C8A96A] transition duration-300',
                                isActive
                                  ? 'bg-[#243528] text-[#EDE3D6]'
                                  : 'bg-transparent text-[#C8A96A] group-hover:bg-[#243528] group-hover:text-[#EDE3D6]',
                              )}
                            >
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Leaf } from 'lucide-react'
import { bestSellers } from '@/data/home'
import { formatCurrency, cn } from '@utils/index'
import { productImageUrl } from '@utils/productImage'
import { ROUTES } from '@/routes/paths'
import { gsap, ScrollTrigger, useGsap } from '@animations/gsap'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useCatalog } from '@contexts/CatalogContext'
import { AddToCartButton } from '@components/ui'

const titleWords: { text: string; italic?: boolean }[] = [
  { text: 'Loved' },
  { text: 'rituals', italic: true },
]

export function HomeBestSellers() {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { getBySlug } = useCatalog()

  const getBurstTheme = (slug: string) => {
    if (slug.includes('coffee')) return 'coffee'
    if (slug.includes('lavender')) return 'lavender'
    if (slug.includes('tea-tree')) return 'tea-tree'
    return 'botanical' as const
  }

  const scope = useGsap(() => {
    if (!scope.current) return

    const eyebrow = scope.current.querySelector('[data-bs-eyebrow]')
    const words = scope.current.querySelectorAll('[data-bs-word]')
    const subtitle = scope.current.querySelector('[data-bs-subtitle]')
    const cards = scope.current.querySelectorAll('[data-bs-card]')
    const cta = scope.current.querySelector('[data-bs-cta]')

    gsap.set(
      [eyebrow, ...Array.from(words), subtitle, ...Array.from(cards), cta].filter(Boolean),
      { y: 24, opacity: 0 },
    )

    const tl = gsap.timeline({ paused: true })

    if (eyebrow) {
      tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    }
    if (words.length) {
      tl.to(
        words,
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' },
        '-=0.2',
      )
    }
    if (subtitle) {
      tl.to(subtitle, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    }
    if (cards.length) {
      tl.to(
        cards,
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
        '-=0.1',
      )
    }
    if (cta) {
      tl.to(cta, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    }

    const trigger = ScrollTrigger.create({
      trigger: scope.current,
      start: 'top 78%',
      onEnter: () => tl.restart(),
      onEnterBack: () => tl.restart(),
    })

    return () => {
      tl.kill()
      trigger.kill()
    }
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden pt-[clamp(3rem,6vw,4.75rem)] pb-[clamp(3.5rem,7vw,5.5rem)]"
      style={{
        backgroundColor: '#f5f0e7',
        backgroundImage: [
          'radial-gradient(ellipse 75% 50% at 8% 18%, rgba(158,138,98,0.18), transparent 62%)',
          'radial-gradient(ellipse 60% 48% at 96% 22%, rgba(112,128,92,0.11), transparent 58%)',
          'radial-gradient(ellipse 90% 40% at 48% 0%, rgba(255,252,246,0.85), transparent 55%)',
          'radial-gradient(ellipse 70% 42% at 70% 95%, rgba(186,150,110,0.12), transparent 58%)',
          'linear-gradient(180deg, #faf6ef 0%, #f2ebe1 48%, #ebe3d6 100%)',
        ].join(', '),
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-4 w-[min(48vw,26rem)] opacity-[0.12]"
        viewBox="0 0 500 600"
        fill="none"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path
            d="M340 0 C320 60, 280 120, 240 180 C220 210, 190 240, 160 280 C140 310, 120 340, 110 380"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.7"
          />
          <path d="M340 20 C355 35, 360 60, 345 75 C330 60, 325 35, 340 20Z" />
          <path d="M320 60 C300 50, 280 55, 275 75 C290 80, 310 75, 320 60Z" />
          <path d="M300 100 C320 95, 340 105, 340 125 C320 125, 300 115, 300 100Z" />
          <path d="M280 130 C260 115, 240 118, 235 138 C250 145, 270 140, 280 130Z" />
          <path d="M245 200 C225 185, 205 190, 200 210 C218 218, 238 212, 245 200Z" />
          <path d="M200 270 C180 258, 160 262, 158 282 C175 288, 194 282, 200 270Z" />
        </g>
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-6 top-10 w-[min(40vw,22rem)] opacity-[0.1]"
        viewBox="0 0 440 520"
        fill="none"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path
            d="M100 0 C130 70, 170 130, 220 190 C250 220, 280 260, 300 310 C310 340, 320 370, 320 410"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            opacity="0.6"
          />
          <path d="M110 30 C90 40, 82 62, 95 78 C112 68, 118 45, 110 30Z" />
          <path d="M160 120 C140 112, 125 118, 125 138 C142 142, 158 135, 160 120Z" />
          <path d="M215 205 C195 195, 180 200, 180 220 C196 224, 212 217, 215 205Z" />
          <path d="M270 290 C252 280, 238 286, 238 304 C254 308, 268 302, 270 290Z" />
        </g>
      </svg>

      <div className="container-aura relative">
        <header className="mx-auto max-w-2xl text-center">
          <div data-bs-eyebrow="" className="flex flex-col items-center gap-3">
            <Leaf className="h-7 w-7 text-[#b8975c]" strokeWidth={1.2} />
            <p className="text-[0.62rem] font-medium tracking-[0.32em] uppercase text-[#8a8478]">
              Best sellers
            </p>
          </div>
          <h2
            className="mt-4 font-display text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.12] tracking-tight text-forest"
            aria-label="Loved rituals"
          >
            {titleWords.map((word, i) => (
              <span key={`${word.text}-${i}`}>
                {i > 0 ? ' ' : null}
                <span
                  data-bs-word=""
                  className={`inline-block ${word.italic ? 'italic font-normal text-[#b8975c]' : ''}`}
                >
                  {word.text}
                </span>
              </span>
            ))}
          </h2>
          <p
            data-bs-subtitle=""
            className="mx-auto mt-4 max-w-md text-[0.95rem] font-light leading-[1.7] text-[#6a645c]"
          >
            Quiet favorites from our shelves — botanicals chosen again and again.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {bestSellers.slice(0, 8).map((item) => {
            const catalog = getBySlug(item.slug)
            const productId = catalog?.id
            const variantId = catalog?.variants[0]?.id
            const wished = productId ? has(productId) : false

            return (
              <article
                key={item.slug}
                data-bs-card=""
                className="group relative flex flex-col overflow-hidden rounded-[1.1rem] bg-[#faf7f1] shadow-[0_1px_0_rgba(36,53,40,0.04)] ring-1 ring-[#243528]/10 transition-[box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(36,53,40,0.1)]"
              >
                <div className="relative aspect-[9/10] overflow-hidden bg-[#ebe4d8]">
                  <Link to={`/product/${item.slug}`} className="block h-full w-full">
                    <img
                      src={productImageUrl(item.image, 'card')}
                      alt={item.title}
                      className="h-full w-full object-contain p-1.5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] sm:p-2"
                      loading="lazy"
                      decoding="async"
                      width={360}
                      height={450}
                    />
                  </Link>

                  <span className="pointer-events-none absolute left-3 top-3 text-[0.48rem] font-medium tracking-[0.2em] uppercase text-[#8a8478] sm:left-4 sm:top-4 sm:text-[0.5rem]">
                    Best seller
                  </span>

                  <button
                    type="button"
                    aria-label={
                      wished
                        ? `Remove ${item.title} from wishlist`
                        : `Add ${item.title} to wishlist`
                    }
                    aria-pressed={wished}
                    disabled={!productId}
                    onClick={() => {
                      if (!productId) return
                      toggle(productId)
                    }}
                    className={cn(
                      'absolute right-3 top-3 inline-flex items-center justify-center text-charcoal/70 transition-colors duration-300 hover:text-forest sm:right-4 sm:top-4',
                      wished && 'text-forest',
                    )}
                  >
                    <Heart
                      className={cn('h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]', wished && 'fill-current')}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between px-3.5 py-4 sm:px-4 sm:py-5">
                  <div>
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-display text-[1.05rem] leading-snug tracking-tight text-[#243528] transition-colors group-hover:text-forest sm:text-[1.15rem]">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-[0.88rem] font-medium text-forest">
                        {formatCurrency(item.price)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[0.75rem] text-[#8a8478] line-through">
                          {formatCurrency(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <AddToCartButton
                      size="sm"
                      fullWidth
                      burstTheme={getBurstTheme(item.slug)}
                      disabled={!productId || !variantId}
                      onClick={() => {
                        if (!productId || !variantId) return
                        addItem(productId, variantId, 1)
                      }}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div data-bs-cta="" className="mt-12 flex justify-center sm:mt-14">
          <Link
            to={ROUTES.bestSellers}
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-forest/30 bg-transparent px-8 text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-forest transition-colors duration-400 hover:border-[#b8975c] hover:bg-[#b8975c]/10"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,
  Hand,
  Heart,
  Leaf,
  Sparkles,
  Sprout,
  Sun,
} from 'lucide-react'
import { bestSellers, type BestSellerPill } from '@/data/home'
import { formatCurrency, cn } from '@utils/index'
import { productImageUrl } from '@utils/productImage'
import { ROUTES } from '@/routes/paths'
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from '@animations/gsap'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useCatalog } from '@contexts/CatalogContext'
import { AddToCartButton } from '@components/ui'

const titleWords: { text: string; italic?: boolean }[] = [
  { text: 'Loved' },
  { text: 'rituals', italic: true },
]

const pillIconColor: Record<BestSellerPill['icon'], string> = {
  leaf: 'text-[#5a8a52]',
  drop: 'text-[#5a7fa0]',
  sprout: 'text-[#5a8a4a]',
  spark: 'text-[#b8975c]',
  heart: 'text-[#8a5c6a]',
  sun: 'text-[#c08a3a]',
  hand: 'text-[#8a7348]',
}

function PillIcon({ icon }: { icon: BestSellerPill['icon'] }) {
  const cls = cn('h-2.5 w-2.5 shrink-0', pillIconColor[icon])
  switch (icon) {
    case 'drop':
      return <Droplets className={cls} strokeWidth={2.2} />
    case 'sprout':
      return <Sprout className={cls} strokeWidth={2.2} />
    case 'spark':
      return <Sparkles className={cls} strokeWidth={2.2} />
    case 'heart':
      return <Heart className={cls} strokeWidth={2.2} />
    case 'sun':
      return <Sun className={cls} strokeWidth={2.2} />
    case 'hand':
      return <Hand className={cls} strokeWidth={2.2} />
    default:
      return <Leaf className={cls} strokeWidth={2.2} />
  }
}

function WishlistFlashButton({
  title,
  productId,
  wished,
  onToggle,
}: {
  title: string
  productId?: string
  wished: boolean
  onToggle: () => void
}) {
  const [flash, setFlash] = useState(false)
  const heartRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = () => {
    if (!productId) return
    const adding = !wished
    onToggle()
    if (!adding) return

    setFlash(true)
    if (heartRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        heartRef.current,
        { scale: 1 },
        {
          scale: 1.35,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
    }
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setFlash(false), 800)
  }

  return (
    <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
      {flash && (
        <span
          role="status"
          className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#b08d57] px-2 py-0.5 text-[0.55rem] font-semibold tracking-wide text-white shadow-[0_6px_16px_rgba(176,141,87,0.35)]"
        >
          Saved!
        </span>
      )}
      <button
        type="button"
        aria-label={
          wished || flash
            ? `Remove ${title} from wishlist`
            : `Add ${title} to wishlist`
        }
        aria-pressed={wished || flash}
        disabled={!productId}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-full p-1 transition-colors duration-300',
          wished || flash
            ? 'text-[#b08d57]'
            : 'text-charcoal/70 hover:text-forest',
        )}
      >
        <span ref={heartRef} className="inline-flex origin-center">
          <Heart
            className={cn(
              'h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]',
              (wished || flash) && 'fill-current',
            )}
            strokeWidth={1.5}
          />
        </span>
      </button>
    </div>
  )
}

export function HomeBestSellers() {
  const { addItem, updateQty, items } = useCart()
  const { has, toggle } = useWishlist()
  const { getBySlug } = useCatalog()

  const getBurstTheme = (slug: string) => {
    if (slug.includes('coffee')) return 'coffee' as const
    if (slug.includes('lavender')) return 'lavender' as const
    if (slug.includes('tea-tree')) return 'tea-tree' as const
    return 'botanical' as const
  }

  // Warm the image cache before the section enters view
  useEffect(() => {
    bestSellers.slice(0, 8).forEach((item) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = productImageUrl(item.image, 'full')
    })
  }, [])

  const scope = useGsap(() => {
    if (!scope.current) return
    if (prefersReducedMotion()) return

    const eyebrow = scope.current.querySelector('[data-bs-eyebrow]')
    const words = scope.current.querySelectorAll('[data-bs-word]')
    const subtitle = scope.current.querySelector('[data-bs-subtitle]')
    const cards = Array.from(scope.current.querySelectorAll<HTMLElement>('[data-bs-card]'))
    const cta = scope.current.querySelector('[data-bs-cta]')

    gsap.set([eyebrow, ...Array.from(words), subtitle, cta].filter(Boolean), {
      y: 18,
      opacity: 0,
    })
    gsap.set(cards, { y: 28, opacity: 0.001 })

    const tl = gsap.timeline({ paused: true })

    if (eyebrow) {
      tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
    }
    if (words.length) {
      tl.to(
        words,
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
        '-=0.2',
      )
    }
    if (subtitle) {
      tl.to(subtitle, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.18')
    }

    // One-by-one card flow
    if (cards.length) {
      tl.to(
        cards,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.14,
          ease: 'power2.out',
          force3D: true,
        },
        '-=0.05',
      )
    }

    if (cta) {
      tl.to(cta, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.15')
    }

    const trigger = ScrollTrigger.create({
      trigger: scope.current,
      start: 'top 80%',
      once: true,
      onEnter: () => tl.play(0),
    })

    return () => {
      tl.kill()
      trigger.kill()
    }
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-x-clip bg-[#f3ebe0] pt-[clamp(3rem,6vw,4.75rem)] pb-[clamp(3.5rem,7vw,5.5rem)]"
    >
      <div className="container-aura relative min-w-0">
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

        <div className="mt-12 grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:mt-14 lg:grid-cols-2 xl:grid-cols-4 lg:gap-5">
          {bestSellers.slice(0, 8).map((item, index) => {
            const catalog = getBySlug(item.slug)
            const productId = catalog?.id
            const variantId = catalog?.variants[0]?.id
            const wished = productId ? has(productId) : false
            const imageSrc = productImageUrl(item.image, 'full')

            return (
              <article
                key={item.slug}
                data-bs-card=""
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.1rem] bg-[#faf7f1] shadow-[0_1px_0_rgba(36,53,40,0.04)] ring-1 ring-[#243528]/10 transition-[box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(36,53,40,0.1)]"
              >
                <div className="relative aspect-[9/10] overflow-hidden bg-[#ebe4d8]">
                  <Link to={`/product/${item.slug}`} className="block h-full w-full">
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 2 ? 'high' : 'low'}
                      width={360}
                      height={400}
                    />
                  </Link>

                  <span className="pointer-events-none absolute left-3 top-3 text-[0.48rem] font-medium tracking-[0.2em] uppercase text-[#8a8478] sm:left-4 sm:top-4 sm:text-[0.5rem]">
                    Best seller
                  </span>

                  <WishlistFlashButton
                    title={item.title}
                    productId={productId}
                    wished={wished}
                    onToggle={() => {
                      if (!productId) return
                      toggle(productId)
                    }}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3.5 sm:px-4 sm:py-5">
                  <div className="min-w-0">
                    <div className="mb-2.5 flex w-full min-w-0 flex-wrap items-center gap-1">
                      {item.pills.map((pill) => (
                        <span
                          key={pill.label}
                          className="inline-flex max-w-full items-center gap-0.5 truncate rounded-full border border-[#c4a35a]/55 bg-[#faf7f1] px-1.5 py-0.5 text-[0.48rem] font-medium leading-none tracking-wide text-[#4a463e] sm:gap-1 sm:px-2 sm:py-[0.2rem] sm:text-[0.55rem]"
                        >
                          <PillIcon icon={pill.icon} />
                          <span className="truncate">{pill.label}</span>
                        </span>
                      ))}
                    </div>

                    <Link to={`/product/${item.slug}`} className="block min-w-0">
                      <h3 className="font-display text-[1.05rem] leading-snug tracking-tight text-[#243528] transition-colors group-hover:text-forest sm:text-[1.15rem]">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className="text-[0.7rem] tracking-[0.08em] text-[#c4a35a]"
                        aria-hidden
                      >
                        ★★★★★
                      </span>
                      <span className="text-[0.68rem] text-[#6a645c]">
                        {item.rating.toFixed(1)}
                        <span className="text-[#9a948c]"> ({item.reviewCount})</span>
                      </span>
                    </div>

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
                      deferBurst
                      burstTheme={getBurstTheme(item.slug)}
                      disabled={!productId || !variantId}
                      quantity={
                        productId && variantId
                          ? (items.find(
                              (l) =>
                                l.productId === productId &&
                                l.variantId === variantId,
                            )?.quantity ?? 0)
                          : 0
                      }
                      onAdd={() => {
                        if (!productId || !variantId) return
                        addItem(productId, variantId, 1)
                      }}
                      onIncrement={() => {
                        if (!productId || !variantId) return
                        const current =
                          items.find(
                            (l) =>
                              l.productId === productId &&
                              l.variantId === variantId,
                          )?.quantity ?? 0
                        updateQty(productId, variantId, current + 1)
                      }}
                      onDecrement={() => {
                        if (!productId || !variantId) return
                        const current =
                          items.find(
                            (l) =>
                              l.productId === productId &&
                              l.variantId === variantId,
                          )?.quantity ?? 0
                        updateQty(productId, variantId, current - 1)
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

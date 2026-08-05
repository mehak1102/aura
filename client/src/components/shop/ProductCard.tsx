import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Leaf, Star, Trash2 } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { formatCurrency, cn } from '@utils/index'
import { getSalePrice } from '@utils/shop'
import { ProductImage, AddToCartButton } from '@components/ui'
import { useWishlist } from '@contexts/WishlistContext'
import { useCart } from '@contexts/CartContext'
import { useQuickView } from '@components/shop/QuickView'
import { gsap, prefersReducedMotion } from '@animations/gsap'
import { ROUTES } from '@/routes/paths'

type ProductCardProps = {
  product: CatalogProduct
  className?: string
  /** Shows a remove action beside the cart control (used on the wishlist). */
  onRemove?: () => void
  /** Navigate to the cart once the product is added (shop listing behaviour). */
  goToCartOnAdd?: boolean
}

const CART_NAV_DELAY_MS = 1100

function getBurstTheme(slug: string) {
  if (slug.includes('coffee')) return 'coffee' as const
  if (slug.includes('lavender')) return 'lavender' as const
  if (slug.includes('tea-tree')) return 'tea-tree' as const
  return 'botanical' as const
}

export function ProductCard({
  product,
  className,
  onRemove,
  goToCartOnAdd,
}: ProductCardProps) {
  const navigate = useNavigate()
  const price = getSalePrice(product)
  const image = product.images[0]
  const { has, toggle } = useWishlist()
  const { addItem, updateQty, items } = useCart()
  const quickView = useQuickView()
  const wished = has(product.id)
  const variant = product.variants[0]
  const [savedFlash, setSavedFlash] = useState(false)
  const heartRef = useRef<HTMLSpanElement>(null)
  const flashTimer = useRef<number | null>(null)
  const cartNavTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current)
      if (cartNavTimer.current) window.clearTimeout(cartNavTimer.current)
    }
  }, [])

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault()
    const adding = !wished
    toggle(product.id)
    if (!adding) return

    setSavedFlash(true)
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
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setSavedFlash(false), 800)
  }

  const rating = product.ratingCount > 0 ? product.ratingAverage : 4.8
  const reviewCount = product.ratingCount > 0 ? product.ratingCount : 128
  const quantity =
    variant
      ? (items.find(
          (l) => l.productId === product.id && l.variantId === variant.id,
        )?.quantity ?? 0)
      : 0

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-[1.25rem] bg-[#ebe4d6]',
        'shadow-[0_8px_28px_rgba(40,35,25,0.1)]',
        'transition-transform duration-500 hover:-translate-y-1',
        className,
      )}
      data-product-card=""
    >
      {/* ── Image ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe4d6]">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 block">
          <ProductImage
            src={image?.url ?? ''}
            alt={image?.alt || product.title}
            size="full"
            className="!bg-transparent h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            width={560}
            height={750}
          />
        </Link>

        {/* Soft merge into cream-beige info panel */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[28%] bg-gradient-to-b from-transparent via-[#ebe4d6]/25 to-[#ebe4d6]"
          aria-hidden
        />

        <div className="pointer-events-none absolute top-3.5 left-3.5 z-10 flex flex-col items-start gap-1.5">
          {product.isBestSeller && (
            <span className="pointer-events-none inline-flex items-center gap-1.5 rounded-full bg-[#1c261c] px-3 py-[5px] text-[0.6rem] font-medium tracking-[0.14em] text-white uppercase">
              <Leaf className="h-3 w-3" strokeWidth={2} />
              Best seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="inline-flex rounded-full bg-[#e8dfd0] px-3 py-[5px] text-[0.6rem] font-medium tracking-[0.14em] text-[#1c261c] uppercase">
              New
            </span>
          )}
        </div>

        <div className="absolute top-3.5 right-3.5 z-10">
          {savedFlash && (
            <span
              role="status"
              className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#b08d57] px-2.5 py-0.5 text-[0.55rem] font-semibold tracking-wide text-white shadow-[0_6px_16px_rgba(176,141,87,0.35)]"
            >
              Saved!
            </span>
          )}
          <button
            type="button"
            aria-label={
              wished || savedFlash
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            aria-pressed={wished || savedFlash}
            onClick={handleWishlist}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center transition-colors',
              wished || savedFlash
                ? 'text-[#c43c3c]'
                : 'text-white hover:text-white/90',
            )}
          >
            <span ref={heartRef} className="inline-flex origin-center">
              <Heart
                className={cn(
                  'h-[1.05rem] w-[1.05rem]',
                  wished || savedFlash ? 'fill-[#c43c3c]' : 'fill-none',
                )}
                strokeWidth={1.5}
              />
            </span>
          </button>
        </div>

        <div className="absolute inset-x-3 bottom-4 z-10 translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          {quickView ? (
            <button
              type="button"
              className="w-full rounded-full bg-[#c4a35a] py-2.5 text-[0.62rem] font-semibold tracking-[0.16em] text-white uppercase shadow-[0_8px_20px_rgba(196,163,90,0.35)] transition-colors hover:bg-[#b8975c]"
              onClick={(e) => {
                e.preventDefault()
                quickView.openQuickView(product)
              }}
            >
              Quick view
            </button>
          ) : (
            <Link
              to={`/product/${product.slug}`}
              className="block w-full rounded-full bg-[#c4a35a] py-2.5 text-center text-[0.62rem] font-semibold tracking-[0.16em] text-white uppercase shadow-[0_8px_20px_rgba(196,163,90,0.35)]"
            >
              View
            </Link>
          )}
        </div>
      </div>

      {/* ── Info + actions ── */}
      <div className="flex flex-col bg-[#ebe4d6] px-4 pt-2 pb-3">
        <span className="inline-flex w-fit rounded-full bg-[#f7f3eb] px-2 py-0.5 text-[0.52rem] font-medium tracking-[0.14em] text-[#3a3a38] uppercase">
          {product.category.replace(/-/g, ' ')}
        </span>

        <Link to={`/product/${product.slug}`} className="mt-1 block">
          <h3 className="font-display text-[1.1rem] leading-[1.2] text-[#1a1a18]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-2.5 w-2.5',
                  i < Math.round(rating)
                    ? 'fill-[#d4a84b] text-[#d4a84b]'
                    : 'fill-transparent text-[#d4a84b]/35',
                )}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-[0.65rem] text-[#6b6b66]">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="shrink-0 font-display text-[1.25rem] leading-none text-[#1a1a18] tabular-nums">
            {formatCurrency(price)}
          </span>

          <div className={cn('min-w-0 flex-1', !onRemove && 'max-w-[10.5rem]')}>
            <AddToCartButton
              size="sm"
              fullWidth
              compact
              deferBurst
              burstTheme={getBurstTheme(product.slug)}
              disabled={!variant}
              quantity={quantity}
              onAdd={() => {
                if (!variant) return
                addItem(product.id, variant.id, 1)
                if (!goToCartOnAdd) return
                // Let the burst + "Added!" confirmation finish before leaving.
                if (cartNavTimer.current)
                  window.clearTimeout(cartNavTimer.current)
                cartNavTimer.current = window.setTimeout(
                  () => navigate(ROUTES.cart),
                  CART_NAV_DELAY_MS,
                )
              }}
              onIncrement={() => {
                if (!variant) return
                updateQty(product.id, variant.id, quantity + 1)
              }}
              onDecrement={() => {
                if (!variant) return
                updateQty(product.id, variant.id, quantity - 1)
              }}
            />
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${product.title}`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1a1a18]/12 bg-[#f7f3eb] text-[#6b6b66] transition-colors hover:border-[#c43c3c]/40 hover:bg-white hover:text-[#c43c3c]"
            >
              <Trash2 className="h-[0.85rem] w-[0.85rem]" strokeWidth={1.6} />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

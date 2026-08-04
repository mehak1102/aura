import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { formatCurrency, cn } from '@utils/index'
import { getSalePrice } from '@utils/shop'
import { ProductImage, AddToCartButton } from '@components/ui'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { gsap, prefersReducedMotion } from '@animations/gsap'

type QuickViewContextValue = {
  openQuickView: (product: CatalogProduct) => void
  closeQuickView: () => void
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null)

/** Returns null when provider is absent */
export function useQuickView() {
  return useContext(QuickViewContext)
}

function getBurstTheme(slug: string) {
  if (slug.includes('coffee')) return 'coffee' as const
  if (slug.includes('lavender')) return 'lavender' as const
  if (slug.includes('tea-tree')) return 'tea-tree' as const
  return 'botanical' as const
}

function QuickViewWishlistButton({
  title,
  productId,
  wished,
  onToggle,
}: {
  title: string
  productId: string
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

  useEffect(() => {
    setFlash(false)
  }, [productId])

  const handleClick = () => {
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

  const active = wished || flash

  return (
    <div className="relative z-20 shrink-0 overflow-visible">
      {flash && (
        <span
          role="status"
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#b08d57] px-2.5 py-1 text-[0.55rem] font-semibold tracking-wide text-white shadow-[0_6px_16px_rgba(176,141,87,0.45)]"
        >
          Saved!
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          active ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`
        }
        aria-pressed={active}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c4a35a]/70 transition-colors hover:border-[#b8975c]"
      >
        <span ref={heartRef} className="inline-flex origin-center">
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              active ? 'fill-[#c43c3c] text-[#c43c3c]' : 'fill-none text-charcoal/70',
            )}
            strokeWidth={1.5}
          />
        </span>
      </button>
    </div>
  )
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const { addItem, updateQty, items } = useCart()
  const { has, toggle } = useWishlist()

  const openQuickView = useCallback((p: CatalogProduct) => setProduct(p), [])
  const closeQuickView = useCallback(() => setProduct(null), [])

  const value = useMemo(
    () => ({ openQuickView, closeQuickView }),
    [openQuickView, closeQuickView],
  )

  const variant = product?.variants[0]
  const wished = product ? has(product.id) : false
  const quantity =
    product && variant
      ? (items.find(
          (l) => l.productId === product.id && l.variantId === variant.id,
        )?.quantity ?? 0)
      : 0

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      {product && (
        <div className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#1b261e]/55 backdrop-blur-sm"
            aria-label="Close quick view"
            onClick={closeQuickView}
          />
          <div
            role="dialog"
            aria-modal
            aria-label={product.title}
            className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#c4a35a]/70 bg-[#F8F5EE] shadow-2xl ring-1 ring-[#c4a35a]/35 md:grid-cols-2"
          >
            <button
              type="button"
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-10 rounded-full bg-warm-white/90 p-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-[4/5] bg-[#f3efe6] md:aspect-auto md:min-h-[28rem]">
              <ProductImage
                src={product.images[0]?.url ?? ''}
                alt={product.title}
                size="card"
                className="h-full w-full object-contain p-8"
              />
            </div>
            <div className="flex flex-col overflow-visible p-8">
              <p className="text-micro text-olive">
                {product.category.replace(/-/g, ' ')}
              </p>
              <h2 className="font-display mt-2 text-3xl text-forest">
                {product.title}
              </h2>
              <p className="mt-3 text-lg text-charcoal">
                {formatCurrency(getSalePrice(product))}
              </p>
              <p className="mt-4 line-clamp-4 text-sm font-light leading-relaxed text-charcoal/75">
                {product.description}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-charcoal/70">
                {product.benefits.slice(0, 3).map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
              <div className="relative z-20 mt-auto flex flex-wrap items-center gap-3 overflow-visible pt-8">
                <div className="min-w-0 flex-1">
                  <AddToCartButton
                    size="sm"
                    fullWidth
                    deferBurst
                    burstTheme={getBurstTheme(product.slug)}
                    disabled={!variant}
                    quantity={quantity}
                    onAdd={() => {
                      if (!variant) return
                      addItem(product.id, variant.id, 1)
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
                <QuickViewWishlistButton
                  title={product.title}
                  productId={product.id}
                  wished={wished}
                  onToggle={() => toggle(product.id)}
                />
                <Link
                  to={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="w-full text-center text-micro tracking-[0.14em] uppercase text-olive"
                >
                  Full details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </QuickViewContext.Provider>
  )
}

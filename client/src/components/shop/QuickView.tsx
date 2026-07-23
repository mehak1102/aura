import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { formatCurrency } from '@utils/index'
import { getSalePrice } from '@utils/shop'
import { ProductImage } from '@components/ui'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'

type QuickViewContextValue = {
  openQuickView: (product: CatalogProduct) => void
  closeQuickView: () => void
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null)

/** Returns null when provider is absent */
export function useQuickView() {
  return useContext(QuickViewContext)
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()

  const openQuickView = useCallback((p: CatalogProduct) => setProduct(p), [])
  const closeQuickView = useCallback(() => setProduct(null), [])

  const value = useMemo(
    () => ({ openQuickView, closeQuickView }),
    [openQuickView, closeQuickView],
  )

  const variant = product?.variants[0]
  const wished = product ? has(product.id) : false

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
            className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#F8F5EE] shadow-2xl md:grid-cols-2"
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
            <div className="flex flex-col p-8">
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
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <button
                  type="button"
                  disabled={!variant}
                  onClick={() => {
                    if (!variant) return
                    addItem(product.id, variant.id, 1)
                    closeQuickView()
                  }}
                  className="flex-1 bg-forest px-5 py-3 text-[0.7rem] tracking-[0.14em] uppercase text-warm-white disabled:opacity-40"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => toggle(product.id)}
                  className="inline-flex h-11 w-11 items-center justify-center border border-charcoal/15"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={
                      wished ? 'h-4 w-4 fill-forest text-forest' : 'h-4 w-4'
                    }
                  />
                </button>
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

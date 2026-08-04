import { useMemo, useState } from 'react'
import {
  Heart,
  Leaf,
  Package,
  RefreshCw,
  Star,
  Tag,
  Truck,
} from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import type { ProductVariant } from '@/types'
import { Badge, Body, Display, Eyebrow, AddToCartButton } from '@components/ui'
import { formatCurrency, cn } from '@utils/index'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { useWishlist } from '@contexts/WishlistContext'
import { useCart } from '@contexts/CartContext'

type ProductInfoProps = {
  product: CatalogProduct
  onAddToCart?: (variant: ProductVariant, qty: number) => void
}

const FEATURE_ICONS = [
  { label: '100% Natural', icon: Leaf },
  { label: 'Cold Pressed', icon: DropletMark },
  { label: 'Unrefined', icon: SparkMark },
  { label: 'Small Batch', icon: BatchMark },
] as const

function DropletMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3C12 3 6 10 6 14.5a6 6 0 0 0 12 0C18 10 12 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BatchMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 7h8v12H8V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 4h4v3h-4V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 11h8M8 15h8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id)
  const { has, toggle } = useWishlist()
  const { items, addItem, updateQty } = useCart()
  const wished = has(product.id)

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  )

  const inStock = (variant?.stock ?? 0) > 0
  const cartQty =
    items.find(
      (l) => l.productId === product.id && l.variantId === variant?.id,
    )?.quantity ?? 0

  const rating = product.ratingCount > 0 ? product.ratingAverage : 4.8
  const reviewCount = product.ratingCount > 0 ? product.ratingCount : 128

  const burstTheme = product.slug.includes('coffee')
    ? ('coffee' as const)
    : product.slug.includes('lavender')
      ? ('lavender' as const)
      : product.slug.includes('tea-tree')
        ? ('tea-tree' as const)
        : ('botanical' as const)

  const handleAdd = () => {
    if (!variant || !inStock) return
    if (onAddToCart) {
      onAddToCart(variant, 1)
    } else {
      addItem(product.id, variant.id, 1)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {product.isNewArrival && <Badge tone="gold">New</Badge>}
        {product.isBestSeller && <Badge tone="forest">Best seller</Badge>}
        {variant.discountPercent > 0 && (
          <Badge tone="beige">-{variant.discountPercent}%</Badge>
        )}
      </div>

      <Eyebrow className="mt-5" tone="olive">
        {product.category.replace(/-/g, ' ')}
      </Eyebrow>

      <Display as="h1" size="md" className="mt-2 text-forest">
        {product.title}
      </Display>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-0.5 text-[#d4a84b]" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < Math.round(rating)
                  ? 'fill-current text-[#d4a84b]'
                  : 'fill-transparent text-[#d4a84b]/35',
              )}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <a
          href="#reviews"
          className="text-sm text-[#8a8478] transition-colors hover:text-forest"
        >
          {rating.toFixed(1)} ({reviewCount} reviews)
        </a>
      </div>

      <Body muted className="mt-5 max-w-md leading-relaxed">
        {product.description}
      </Body>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
        {FEATURE_ICONS.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.04em] text-[#5c574f]"
          >
            <Icon className="h-4 w-4 shrink-0 text-forest" />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex items-baseline gap-3">
        <span className="font-display text-3xl text-charcoal">
          {formatCurrency(variant.price)}
        </span>
        {variant.discountPercent > 0 && (
          <span className="text-lg text-charcoal-muted line-through">
            {formatCurrency(variant.mrp)}
          </span>
        )}
      </div>

      {product.variants.length > 1 && (
        <div className="mt-6">
          <p className="text-micro text-charcoal-muted">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={cn(
                  'min-w-16 rounded-full border px-4 py-2 text-micro transition-colors',
                  v.id === variant.id
                    ? 'border-forest bg-forest text-warm-white'
                    : 'border-charcoal/15 hover:border-forest',
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <div className="w-full max-w-[13.5rem]">
          <AddToCartButton
            disabled={!inStock || !variant}
            label={inStock ? 'Add to Cart' : 'Out of stock'}
            burstTheme={burstTheme}
            deferBurst
            fullWidth
            quantity={cartQty}
            onAdd={handleAdd}
            onIncrement={() => {
              if (!variant) return
              updateQty(product.id, variant.id, cartQty + 1)
            }}
            onDecrement={() => {
              if (!variant) return
              updateQty(product.id, variant.id, cartQty - 1)
            }}
          />
        </div>

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => toggle(product.id)}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c4a35a]/65 transition-colors hover:border-[#b8975c]"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              wished ? 'fill-[#c43c3c] text-[#c43c3c]' : 'text-charcoal/70',
            )}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-[#efeae0] px-4 py-3 text-sm text-[#5c574f]">
        <Truck className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.6} />
        <span>
          {inStock
            ? `${variant.stock} in stock · Ships in 2–4 days`
            : 'Currently unavailable'}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-charcoal/10 pt-6 sm:gap-4">
        <Link
          to={ROUTES.shipping}
          className="group flex flex-col items-start gap-2 pr-3 sm:pr-4"
        >
          <Package
            className="h-4 w-4 text-forest transition-colors group-hover:text-[#b8975c]"
            strokeWidth={1.6}
          />
          <span className="text-[0.62rem] font-medium tracking-[0.16em] text-forest uppercase">
            Shipping
          </span>
          <span className="text-[0.72rem] leading-snug text-[#8a8478]">
            Free shipping over ₹999
          </span>
        </Link>

        <Link
          to={ROUTES.returns}
          className="group flex flex-col items-start gap-2 border-l border-charcoal/10 px-3 sm:px-4"
        >
          <RefreshCw
            className="h-4 w-4 text-forest transition-colors group-hover:text-[#b8975c]"
            strokeWidth={1.6}
          />
          <span className="text-[0.62rem] font-medium tracking-[0.16em] text-forest uppercase">
            Returns
          </span>
          <span className="text-[0.72rem] leading-snug text-[#8a8478]">
            Easy returns within 7 days
          </span>
        </Link>

        <div className="flex flex-col items-start gap-2 border-l border-charcoal/10 pl-3 sm:pl-4">
          <Tag className="h-4 w-4 text-forest" strokeWidth={1.6} />
          <span className="text-[0.62rem] font-medium tracking-[0.16em] text-forest uppercase">
            SKU
          </span>
          <span className="text-[0.72rem] leading-snug break-all text-[#8a8478]">
            {variant.sku}
          </span>
        </div>
      </div>
    </div>
  )
}

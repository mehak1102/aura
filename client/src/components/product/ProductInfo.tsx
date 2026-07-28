import { useMemo, useState } from 'react'
import { Heart, Minus, Plus, Star } from 'lucide-react'
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

export function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id)
  const [qty, setQty] = useState(1)
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
      onAddToCart(variant, qty)
    } else {
      addItem(product.id, variant.id, qty)
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

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-soft-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < Math.round(product.ratingAverage)
                  ? 'fill-current'
                  : 'text-charcoal/20',
              )}
            />
          ))}
        </div>
        <a href="#reviews" className="text-sm text-charcoal-muted hover:text-forest">
          {product.ratingAverage} · {product.ratingCount} reviews
        </a>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-display text-3xl text-charcoal">
          {formatCurrency(variant.price)}
        </span>
        {variant.discountPercent > 0 && (
          <span className="text-lg text-charcoal-muted line-through">
            {formatCurrency(variant.mrp)}
          </span>
        )}
      </div>

      <Body muted className="mt-5 max-w-md">
        {product.description}
      </Body>

      {product.variants.length > 1 && (
        <div className="mt-8">
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

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center border border-charcoal/15">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="px-3 py-3 hover:bg-beige/50"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-10 text-center text-sm">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="px-3 py-3 hover:bg-beige/50"
            onClick={() =>
              setQty((q) => Math.min(variant.stock || 10, q + 1))
            }
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <AddToCartButton
          disabled={!inStock || !variant}
          label={inStock ? 'Add to Cart' : 'Out of stock'}
          burstTheme={burstTheme}
          deferBurst
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

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => toggle(product.id)}
          className={cn(
            'inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors',
            wished
              ? 'border-forest text-forest'
              : 'border-charcoal/15 hover:border-forest hover:text-forest',
          )}
        >
          <Heart
            className={cn('h-4 w-4', wished && 'fill-current')}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <p className="mt-4 text-sm text-charcoal-muted">
        {inStock
          ? `${variant.stock} in stock · Ships in 2–4 days`
          : 'Currently unavailable'}
      </p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-charcoal/10 pt-6 text-micro text-olive">
        <Link to={ROUTES.shipping}>Shipping</Link>
        <Link to={ROUTES.returns}>Returns</Link>
        <span>SKU {variant.sku}</span>
      </div>
    </div>
  )
}

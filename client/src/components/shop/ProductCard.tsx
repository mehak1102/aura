import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { formatCurrency, cn } from '@utils/index'
import { getSalePrice } from '@utils/shop'
import { Badge, ProductImage } from '@components/ui'
import { useWishlist } from '@contexts/WishlistContext'
import { useQuickView } from '@components/shop/QuickView'

type ProductCardProps = {
  product: CatalogProduct
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const price = getSalePrice(product)
  const image = product.images[0]
  const { has, toggle } = useWishlist()
  const wished = has(product.id)
  const quickView = useQuickView()

  return (
    <article className={cn('group flex flex-col', className)} data-product-card="">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3efe6]">
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          <ProductImage
            src={image?.url ?? ''}
            alt={image?.alt || product.title}
            size="card"
            className="h-full w-full object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
            width={480}
            height={600}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNewArrival && <Badge tone="gold">New</Badge>}
          {product.isBestSeller && <Badge tone="forest">Best seller</Badge>}
          {product.discountPercent > 0 && (
            <Badge tone="beige">-{product.discountPercent}%</Badge>
          )}
        </div>

        <button
          type="button"
          aria-label={
            wished
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          className={cn(
            'absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F5EE]/95 transition-all duration-300',
            wished
              ? 'text-forest opacity-100'
              : 'text-charcoal opacity-0 group-hover:opacity-100',
          )}
        >
          <Heart
            className={cn('h-4 w-4', wished && 'fill-current')}
            strokeWidth={1.5}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          {quickView ? (
            <button
              type="button"
              className="w-full bg-[#1b261e] py-2.5 text-[0.65rem] tracking-[0.16em] uppercase text-[#F8F5EE]"
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
              className="block w-full bg-[#1b261e] py-2.5 text-center text-[0.65rem] tracking-[0.16em] uppercase text-[#F8F5EE]"
            >
              View
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-0.5">
        <p className="text-[0.65rem] tracking-[0.14em] uppercase text-olive">
          {product.category.replace(/-/g, ' ')}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display mt-1 text-[1.15rem] leading-snug text-[#1b261e] transition-colors group-hover:text-[#b8975c]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-[#1b261e]">
              {formatCurrency(price)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-sm text-charcoal-muted line-through">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-micro text-charcoal-muted">
            {product.ratingCount > 0 && (
              <>
                <Star className="h-3 w-3 fill-soft-gold text-soft-gold" />
                {product.ratingAverage}
              </>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}

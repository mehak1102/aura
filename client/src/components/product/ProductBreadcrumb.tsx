import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import type { CatalogProduct } from '@/types/shop'

type ProductBreadcrumbProps = {
  product: CatalogProduct
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const categoryPath = `/shop/${product.category}`

  return (
    <nav aria-label="Breadcrumb" className="text-micro text-charcoal-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to={ROUTES.home} className="hover:text-forest">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link to={ROUTES.shop} className="hover:text-forest">
            Shop
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link to={categoryPath} className="capitalize hover:text-forest">
            {product.category.replace(/-/g, ' ')}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-charcoal">{product.title}</li>
      </ol>
    </nav>
  )
}

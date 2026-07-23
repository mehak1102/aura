import { useState } from 'react'
import { Body, Display, Eyebrow } from '@components/ui'
import { Seo } from '@components/seo/Seo'
import { ProductCard } from './ProductCard'
import { ShopFiltersPanel } from './ShopFilters'
import { ShopToolbar } from './ShopToolbar'
import { useShopFilters } from '@hooks/useShopFilters'
import {
  useGsap,
  revealCommerceHeader,
  revealCommerceGrid,
} from '@animations/gsap'
import {
  CATEGORY_META,
  type ProductCategory,
  type ShopFilters,
  type ShopSort,
} from '@/types/shop'

type ShopViewProps = {
  metaKey?: keyof typeof CATEGORY_META
  title?: string
  eyebrow?: string
  description?: string
  defaults?: Partial<ShopFilters>
  hideCategoryFilter?: boolean
  seoTitle?: string
}

export function ShopView({
  metaKey = 'all',
  title,
  eyebrow,
  description,
  defaults,
  hideCategoryFilter,
  seoTitle,
}: ShopViewProps) {
  const meta = CATEGORY_META[metaKey]
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { filters, products, setFilter, clearFilters } = useShopFilters({
    category:
      metaKey !== 'all' &&
      metaKey !== 'best-sellers' &&
      metaKey !== 'new-arrivals'
        ? (metaKey as ProductCategory)
        : defaults?.category,
    bestSeller: metaKey === 'best-sellers' || defaults?.bestSeller,
    newArrival: metaKey === 'new-arrivals' || defaults?.newArrival,
    ...defaults,
  })

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceHeader(scope.current)
    revealCommerceGrid(scope.current)
  }, [products.length, filters.sort, metaKey])

  return (
    <>
      <Seo
        title={seoTitle || title || meta.title}
        description={description || meta.description}
      />

      <div ref={scope}>
      <section className="pt-28 md:pt-32">
        <div className="container-aura pb-10 md:pb-14">
          <Eyebrow data-page-reveal="">{eyebrow || meta.eyebrow}</Eyebrow>
          <Display data-page-reveal="" as="h1" size="lg" className="mt-3 text-forest">
            {title || meta.title}
          </Display>
          <Body data-page-reveal="" muted className="mt-4 max-w-xl">
            {description || meta.description}
          </Body>
        </div>
      </section>

      <section className="pb-[var(--spacing-section)]">
        <div className="container-aura flex gap-10 lg:gap-14">
          <ShopFiltersPanel
            filters={filters}
            setFilter={setFilter}
            clearFilters={clearFilters}
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            hideCategory={hideCategoryFilter}
          />

          <div className="min-w-0 flex-1">
            <ShopToolbar
              count={products.length}
              sort={filters.sort ?? 'featured'}
              onSortChange={(sort: ShopSort) => setFilter('sort', sort)}
              onOpenFilters={() => setFiltersOpen(true)}
            />

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <Display as="h2" size="sm" className="text-forest">
                  No products found
                </Display>
                <Body muted className="mt-3">
                  Try clearing filters or searching a different botanical.
                </Body>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 text-micro text-olive hover:text-forest"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

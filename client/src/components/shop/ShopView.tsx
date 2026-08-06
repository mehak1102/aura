import { useState } from 'react'
import { Body, Display, Eyebrow, LeafShadows } from '@components/ui'
import { Seo } from '@components/seo/Seo'
import { ProductCard } from './ProductCard'
import { ShopFiltersPanel } from './ShopFilters'
import { ShopToolbar } from './ShopToolbar'
import { useShopFilters } from '@hooks/useShopFilters'
import { useCatalog } from '@contexts/CatalogContext'
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
  /** Send the shopper straight to the cart after adding a product. */
  goToCartOnAdd?: boolean
}

function LeafDivider() {
  return (
    <div className="mt-3 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-10 bg-[#b8975c]/45 sm:w-14" />
      <span className="h-1 w-1 rounded-full bg-[#b8975c]/70" />
      <span className="h-px w-10 bg-[#b8975c]/45 sm:w-14" />
    </div>
  )
}

export function ShopView({
  metaKey = 'all',
  title,
  eyebrow,
  description,
  defaults,
  hideCategoryFilter,
  seoTitle,
  goToCartOnAdd,
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
  const { isLoading, isError, refetch } = useCatalog()

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

      <div ref={scope} className="shop-page relative min-h-full overflow-hidden bg-[#eae2d4]">
        <LeafShadows />

        <section className="shop-hero relative z-[1] overflow-hidden pt-24 md:pt-28">
          <div className="container-aura relative z-[1] pb-6 text-center md:pb-8">
            <Eyebrow data-page-reveal="" tone="gold">
              {eyebrow || meta.eyebrow}
            </Eyebrow>
            <Display
              data-page-reveal=""
              as="h1"
              size="md"
              className="mt-2 text-forest"
            >
              {title || meta.title}
            </Display>
            <div data-page-reveal="">
              <LeafDivider />
            </div>
            <Body
              data-page-reveal=""
              muted
              className="mx-auto mt-3 max-w-xl text-balance text-[0.95rem]"
            >
              {description || meta.description}
            </Body>
          </div>
        </section>

        <section className="relative z-[1] pb-[var(--spacing-section)]">
          <div className="container-aura flex gap-8 lg:gap-12 xl:gap-14">
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

              {isError ? (
                <div className="py-24 text-center" role="alert">
                  <Display as="h2" size="sm" className="text-forest">
                    Catalog unavailable
                  </Display>
                  <Body muted className="mt-3">
                    We could not load products right now. Please try again.
                  </Body>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-6 text-micro text-olive hover:text-forest"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoading && products.length === 0 ? (
                <div className="py-24 text-center">
                  <Body muted>Loading products…</Body>
                </div>
              ) : products.length === 0 ? (
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
                <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      goToCartOnAdd={goToCartOnAdd}
                    />
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

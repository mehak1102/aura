import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import {
  ProductBreadcrumb,
  ProductGallery,
  ProductInfo,
  ProductTabs,
  ProductReviews,
  ProductRail,
  ProductRoutineTimeline,
} from '@components/product'
import {
  BackButton,
  Body,
  Display,
  Button,
  LeafShadows,
} from '@components/ui'
import {
  getRecommendedProducts,
  getRelatedProducts,
} from '@utils/product'
import { useRecentlyViewed } from '@hooks/useRecentlyViewed'
import { useCart } from '@contexts/CartContext'
import { useCatalog } from '@contexts/CatalogContext'
import { productsApi } from '@services/api/products'
import {
  useGsap,
  revealCommerceBlocks,
} from '@animations/gsap'
import { ROUTES } from '@/routes/paths'
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  productPath,
} from '@/lib/seo'
import type { ProductVariant } from '@/types'

export default function ProductDetailsPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products: catalog, getBySlug } = useCatalog()

  const { data: product } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: Boolean(slug),
    initialData: () => getBySlug(slug),
    staleTime: 60_000,
  })

  const resolved = product ?? getBySlug(slug)
  const recentlyViewed = useRecentlyViewed(resolved?.slug)

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
  }, [slug])

  if (!resolved) {
    return (
      <>
        <Seo title="Product not found" noindex />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          Product not found
        </Display>
        <Body muted className="mt-4 max-w-md">
          This ritual may have sold out or the link is outdated.
        </Body>
        <div className="mt-8">
          <Button onClick={() => navigate(ROUTES.shop)}>
            Back to shop
          </Button>
        </div>
      </main>
      </>
    )
  }

  const related = getRelatedProducts(resolved, catalog)
  const recommended = getRecommendedProducts(resolved, catalog, 4, related)

  const handleAdd = (variant: ProductVariant, qty: number) => {
    addItem(resolved.id, variant.id, qty)
  }

  return (
    <>
      <Seo
        title={resolved.title}
        description={resolved.description}
        canonical={productPath(resolved.slug)}
        image={resolved.images[0]?.url}
        type="product"
        jsonLd={[
          buildProductJsonLd(resolved),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Shop', path: ROUTES.shop },
            { name: resolved.title, path: productPath(resolved.slug) },
          ]),
        ]}
      />
      <main ref={scope} className="product-pdp-shell relative pb-24 pt-28">
        <LeafShadows />
        <section className="container-aura" data-block-reveal="">
          <BackButton
            to={`/shop/${resolved.category}`}
            label="Back to shop"
            className="mb-5"
          />
          <ProductBreadcrumb product={resolved} />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-16">
            <div className="lg:sticky lg:top-28">
              <ProductGallery
                images={[...resolved.images, ...resolved.gallery]}
                title={resolved.title}
              />
            </div>
            <ProductInfo product={resolved} onAddToCart={handleAdd} />
          </div>
        </section>

        <ProductTabs product={resolved} />

        <ProductRoutineTimeline
          steps={[
            {
              step: '01',
              title: 'Prep',
              body: resolved.howToUse[0] ?? 'Cleanse gently before applying.',
            },
            {
              step: '02',
              title: 'Apply',
              body:
                resolved.howToUse[1] ??
                resolved.benefits[0] ??
                'Use as directed for your skin or hair type.',
            },
            {
              step: '03',
              title: 'Layer',
              body:
                resolved.howToUse[2] ??
                'Follow with oil or lotion from the same ritual family.',
            },
          ]}
        />

        <div data-block-reveal="">
          <ProductReviews product={resolved} />
        </div>

        <div className="space-y-2 pb-6 md:pb-8">
          <ProductRail title="You may also like" products={related} />
          <ProductRail title="Recommended rituals" products={recommended} />
          {recentlyViewed.length > 0 && (
            <ProductRail title="Recently viewed" products={recentlyViewed} />
          )}
        </div>
      </main>
    </>
  )
}

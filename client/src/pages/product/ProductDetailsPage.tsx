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
} from '@components/product'
import { Body, Display, MagneticButton } from '@components/ui'
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
  revealCommerceGrid,
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
    revealCommerceGrid(scope.current)
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
          <MagneticButton onClick={() => navigate(ROUTES.shop)}>
            Back to shop
          </MagneticButton>
        </div>
      </main>
      </>
    )
  }

  const related = getRelatedProducts(resolved, catalog)
  const recommended = getRecommendedProducts(resolved, catalog)

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
      <main ref={scope} className="pb-24 pt-28">
        <section className="container-aura" data-block-reveal="">
          <ProductBreadcrumb product={resolved} />

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={[...resolved.images, ...resolved.gallery]}
              title={resolved.title}
            />
            <ProductInfo product={resolved} onAddToCart={handleAdd} />
          </div>
        </section>

        <div data-block-reveal="">
          <ProductTabs product={resolved} />
        </div>

        <section data-block-reveal="" className="section-aura border-y border-charcoal/10 bg-[#f3efe6]">
          <div className="container-aura">
            <p className="text-micro tracking-[0.16em] uppercase text-[#b8975c]">
              Routine
            </p>
            <h2 className="font-display mt-3 text-3xl text-forest md:text-4xl">
              How it fits your day
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
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
              ].map((item) => (
                <article key={item.step} className="bg-cream p-7">
                  <span className="text-micro tracking-[0.2em] text-[#b8975c]">
                    {item.step}
                  </span>
                  <h3 className="font-display mt-3 text-2xl text-forest">{item.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/75">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div data-block-reveal="">
          <ProductReviews product={resolved} />
        </div>

        <div data-block-reveal="">
          <ProductRail title="You may also like" products={related} />
        </div>
        <div data-block-reveal="">
          <ProductRail title="Recommended rituals" products={recommended} />
        </div>
        {recentlyViewed.length > 0 && (
          <div data-block-reveal="">
            <ProductRail title="Recently viewed" products={recentlyViewed} />
          </div>
        )}
      </main>
    </>
  )
}

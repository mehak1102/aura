import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { ProductCard } from '@components/shop/ProductCard'
import { useCatalog } from '@contexts/CatalogContext'
import { getConcernBySlug } from '@/data/concerns'
import { blogArticles } from '@/data/blog'
import { reviews as homeReviews } from '@/data/home'
import { ROUTES } from '@/routes/paths'
import { useGsap, revealCommerceBlocks, revealCommerceGrid } from '@animations/gsap'

export default function ConcernDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const concern = getConcernBySlug(slug)
  const { products } = useCatalog()

  const recommended = useMemo(() => {
    if (!concern) return []
    const bySlug = concern.productSlugs
      .map((s) => products.find((p) => p.slug === s))
      .filter(Boolean)
    if (concern.shopConcern) {
      const extra = products.filter(
        (p) =>
          p.concerns.includes(concern.shopConcern!) &&
          !concern.productSlugs.includes(p.slug),
      )
      return [...bySlug, ...extra].slice(0, 8)
    }
    return bySlug
  }, [concern, products])

  const articles = useMemo(
    () =>
      concern
        ? blogArticles.filter((a) => concern.articleSlugs.includes(a.slug))
        : [],
    [concern],
  )

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [slug])

  if (!concern) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          Concern not found
        </Display>
        <MagneticButton className="mt-8" onClick={() => navigate(ROUTES.concerns)}>
          All concerns
        </MagneticButton>
      </main>
    )
  }

  return (
    <>
      <Seo title={concern.title} description={concern.body} />
      <main ref={scope} className="pb-24">
        <section className="relative min-h-[55vh] overflow-hidden bg-[#1b261e] pt-28">
          <img
            src={concern.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b261e] via-[#1b261e]/70 to-transparent" />
          <div className="container-aura relative z-10 flex min-h-[42vh] flex-col justify-end pb-14">
            <Eyebrow className="text-[#b8975c]">{concern.eyebrow}</Eyebrow>
            <Display as="h1" size="xl" className="mt-3 text-[#F8F5EE]">
              {concern.title}
            </Display>
            <p className="mt-2 font-display text-2xl text-[#e8d9b8]">{concern.headline}</p>
            <Body className="mt-4 max-w-xl text-[#F8F5EE]/85">{concern.body}</Body>
          </div>
        </section>

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura">
            <Eyebrow tone="gold">Recommended products</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              Start here
            </Display>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommended.map(
                (product) =>
                  product && <ProductCard key={product.id} product={product} />,
              )}
            </div>
            {concern.shopConcern && (
              <div className="mt-10">
                <Link
                  to={`${ROUTES.shop}?concern=${concern.shopConcern}`}
                  className="text-micro tracking-[0.14em] uppercase text-olive hover:text-forest"
                >
                  Shop all for {concern.title} →
                </Link>
              </div>
            )}
          </div>
        </section>

        <section data-block-reveal="" className="border-y border-charcoal/10 bg-[#f3efe6] py-20">
          <div className="container-aura">
            <Eyebrow tone="gold">Routine</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              A simple path
            </Display>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {concern.routine.map((step) => (
                <article key={step.step} className="bg-cream p-8">
                  <span className="text-micro tracking-[0.2em] text-[#b8975c]">{step.step}</span>
                  <h3 className="font-display mt-3 text-2xl text-forest">{step.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/75">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {articles.length > 0 && (
          <section data-block-reveal="" className="section-aura">
            <div className="container-aura">
              <Eyebrow tone="gold">Blogs</Eyebrow>
              <Display as="h2" size="md" className="mt-3 text-forest">
                Related reading
              </Display>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {articles.map((article) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group flex gap-5">
                    <div className="h-28 w-36 shrink-0 overflow-hidden bg-beige">
                      <img
                        src={article.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-forest">{article.title}</h3>
                      <p className="mt-2 text-sm font-light text-charcoal/65">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section data-block-reveal="" className="section-aura border-t border-charcoal/10">
          <div className="container-aura max-w-2xl">
            <Eyebrow tone="gold">Reviews</Eyebrow>
            {homeReviews.slice(0, 2).map((review) => (
              <blockquote key={review.name} className="mt-8 border-l-2 border-[#b8975c] pl-6">
                <p className="font-display text-lg font-light italic">“{review.text}”</p>
                <footer className="mt-2 text-micro uppercase tracking-[0.14em] text-olive">
                  {review.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

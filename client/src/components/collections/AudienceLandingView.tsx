import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow } from '@components/ui'
import { ProductCard } from '@components/shop/ProductCard'
import { useCatalog } from '@contexts/CatalogContext'
import { blogArticles } from '@/data/blog'
import { reviews as homeReviews } from '@/data/home'
import type { AudienceLanding } from '@/data/audiences'
import { ROUTES } from '@/routes/paths'
import { useGsap, revealCommerceBlocks, revealCommerceGrid } from '@animations/gsap'
import { cn } from '@utils/index'

type Props = { landing: AudienceLanding }

export function AudienceLandingView({ landing }: Props) {
  const { products } = useCatalog()
  const [activeZone, setActiveZone] = useState(landing.facialMap?.[0]?.id ?? '')

  const featured = useMemo(
    () =>
      landing.featuredSlugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter(Boolean),
    [landing.featuredSlugs, products],
  )

  const articles = useMemo(
    () => blogArticles.filter((a) => landing.articleSlugs.includes(a.slug)),
    [landing.articleSlugs],
  )

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [landing.id])

  const zone = landing.facialMap?.find((z) => z.id === activeZone)

  return (
    <>
      <Seo title={landing.headline} description={landing.body} />
      <main ref={scope} className="bg-[#F8F5EE] pb-24">
        {/* Hero — full-bleed, brand-first */}
        <section className="relative min-h-[88vh] overflow-hidden">
          <img
            src={landing.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b261e] via-[#1b261e]/55 to-[#1b261e]/25" />
          <div className="container-aura relative z-10 flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:pb-20">
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-[#b8975c]">
              {landing.eyebrow}
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.6rem,7vw,5.2rem)] font-medium leading-[1.05] tracking-[0.02em] text-[#F8F5EE]">
              {landing.headline}
            </h1>
            <p className="mt-5 max-w-lg text-[1.05rem] font-light leading-relaxed text-[#F8F5EE]/88">
              {landing.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to={`${ROUTES.shop}?gender=${landing.id}`}
                className="bg-[#F8F5EE] px-7 py-3.5 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-[#1b261e] transition-opacity hover:opacity-90"
              >
                Shop {landing.id}
              </Link>
              <Link
                to={ROUTES.skinQuiz}
                className="border border-[#F8F5EE]/45 px-7 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-[#F8F5EE] transition-colors hover:border-[#b8975c] hover:text-[#b8975c]"
              >
                Skin quiz
              </Link>
            </div>
          </div>
        </section>

        {/* Categories — text links, not cards */}
        <section data-block-reveal="" className="section-aura">
          <div className="container-aura">
            <Eyebrow tone="gold">Shop by category</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              Build your shelf
            </Display>
            <ul className="mt-12 divide-y divide-[#1b261e]/10 border-y border-[#1b261e]/10">
              {landing.categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className="group flex flex-col gap-1 py-6 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="font-display text-2xl text-[#1b261e] group-hover:text-[#b8975c] md:text-3xl">
                      {cat.label}
                    </span>
                    <span className="max-w-md text-sm font-light text-[#1b261e]/55 sm:text-right">
                      {cat.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Routine */}
        {(landing.routine.length > 0 || landing.dayparts) && (
          <section data-block-reveal="" className="bg-[#1b261e] py-20 md:py-24">
            <div className="container-aura">
              <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[#b8975c]">
                {landing.routineTitle}
              </p>
              <h2 className="font-display mt-3 max-w-xl text-[clamp(1.8rem,4vw,3rem)] text-[#F8F5EE]">
                A ritual that fits your day
              </h2>
              <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
                {(landing.dayparts ?? landing.routine).map((step, i) => {
                  const title = 'title' in step ? step.title : ''
                  const body = 'body' in step ? step.body : ''
                  const label =
                    'step' in step && step.step
                      ? step.step
                      : String(i + 1).padStart(2, '0')
                  return (
                    <article key={title} className="relative">
                      <span className="font-display text-5xl text-[#b8975c]/35">
                        {label}
                      </span>
                      <h3 className="font-display mt-2 text-2xl text-[#F8F5EE]">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm font-light leading-relaxed text-[#F8F5EE]/7">
                        {body}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Facial map */}
        {landing.facialMap && (
          <section data-block-reveal="" className="section-aura">
            <div className="container-aura grid items-center gap-14 lg:grid-cols-2">
              <div>
                <Eyebrow tone="gold">Facial exercise map</Eyebrow>
                <Display as="h2" size="md" className="mt-3 text-forest">
                  Touch points for glow
                </Display>
                <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-[#1b261e]/65">
                  Tap a zone for a gentle massage cue — pair it with your favourite oil.
                </p>
                <div className="mt-10 border-l-2 border-[#b8975c] pl-5">
                  <p className="font-display text-2xl text-[#1b261e]">{zone?.label}</p>
                  <p className="mt-2 text-sm font-light leading-relaxed text-[#1b261e]/7">
                    {zone?.tip}
                  </p>
                </div>
              </div>
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-[#e8e2d6]">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"
                  alt="Facial massage map"
                  className="h-full w-full object-cover"
                />
                {landing.facialMap.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    aria-label={z.label}
                    onClick={() => setActiveZone(z.id)}
                    className={cn(
                      'absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all',
                      activeZone === z.id
                        ? 'scale-110 border-[#b8975c] bg-[#b8975c]'
                        : 'border-white/90 bg-white/40 hover:bg-[#b8975c]/70',
                    )}
                    style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured products */}
        <section data-block-reveal="" className="section-aura border-t border-[#1b261e]/8">
          <div className="container-aura">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow tone="gold">Featured</Eyebrow>
                <Display as="h2" size="md" className="mt-3 text-forest">
                  Start with these
                </Display>
              </div>
              <Link
                to={`${ROUTES.shop}?gender=${landing.id}`}
                className="text-[0.7rem] tracking-[0.16em] uppercase text-olive hover:text-forest"
              >
                View all →
              </Link>
            </div>
            <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map(
                (product) =>
                  product && <ProductCard key={product.id} product={product} />,
              )}
            </div>
          </div>
        </section>

        {/* Concerns strip */}
        <section data-block-reveal="" className="border-y border-[#1b261e]/10 bg-[#f3efe6] py-14">
          <div className="container-aura">
            <Eyebrow tone="gold">Shop by concern</Eyebrow>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {landing.shopConcerns.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="font-display text-xl text-[#1b261e] underline decoration-[#b8975c]/40 underline-offset-4 transition-colors hover:text-[#b8975c] md:text-2xl"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {articles.length > 0 && (
          <section data-block-reveal="" className="section-aura">
            <div className="container-aura">
              <Eyebrow tone="gold">Journal</Eyebrow>
              <Display as="h2" size="md" className="mt-3 text-forest">
                Guides worth reading
              </Display>
              <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group">
                    <div className="aspect-[16/10] overflow-hidden bg-[#e8e2d6]">
                      <img
                        src={article.image}
                        alt={article.imageAlt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 text-[0.65rem] tracking-[0.14em] uppercase text-olive">
                      {article.category}
                    </p>
                    <h3 className="font-display mt-1 text-xl text-[#1b261e] group-hover:text-[#b8975c]">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section data-block-reveal="" className="section-aura border-t border-[#1b261e]/8">
          <div className="container-aura max-w-2xl">
            <Eyebrow tone="gold">Reviews</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              Loved in ritual
            </Display>
            <div className="mt-12 space-y-10">
              {homeReviews.slice(0, 3).map((review) => (
                <blockquote key={review.name}>
                  <p className="font-display text-xl font-light italic leading-relaxed text-[#1b261e]/85 md:text-2xl">
                    “{review.text}”
                  </p>
                  <footer className="mt-4 text-[0.65rem] tracking-[0.16em] uppercase text-olive">
                    {review.name} — {review.product}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

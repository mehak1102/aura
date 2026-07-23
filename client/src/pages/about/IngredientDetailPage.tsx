import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { ProductCard } from '@components/shop/ProductCard'
import { useCatalog } from '@contexts/CatalogContext'
import { botanicals, getBotanicalBySlug, botanicalPath } from '@/data/botanicals'
import { ROUTES } from '@/routes/paths'
import { useGsap, revealCommerceBlocks, revealCommerceGrid } from '@animations/gsap'

export default function IngredientDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const botanical = getBotanicalBySlug(slug)
  const { products } = useCatalog()

  const related = useMemo(() => {
    if (!botanical) return []
    const bySlug = botanical.productSlugs
      .map((s) => products.find((p) => p.slug === s))
      .filter(Boolean)
    const byMatch = products.filter((p) =>
      p.ingredients.some((ing) =>
        botanical.matchTerms.some((term) =>
          ing.toLowerCase().includes(term.toLowerCase()),
        ),
      ),
    )
    const map = new Map()
    ;[...bySlug, ...byMatch].forEach((p) => p && map.set(p.id, p))
    return Array.from(map.values())
  }, [botanical, products])

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [slug])

  if (!botanical) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          Ingredient not found
        </Display>
        <MagneticButton className="mt-8" onClick={() => navigate(ROUTES.ingredients)}>
          All ingredients
        </MagneticButton>
      </main>
    )
  }

  return (
    <>
      <Seo
        title={botanical.name}
        description={botanical.howItWorks}
      />
      <main ref={scope} className="pb-24 pt-28">
        <section data-block-reveal="" className="container-aura grid gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden bg-beige">
            <img
              src={botanical.image}
              alt={botanical.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <Eyebrow tone="gold">{botanical.latin}</Eyebrow>
            <Display as="h1" size="lg" className="mt-3 text-forest">
              {botanical.name}
            </Display>
            <Body muted className="mt-6 leading-relaxed">
              {botanical.howItWorks}
            </Body>
            <div className="mt-10">
              <h2 className="font-display text-2xl text-forest">Benefits</h2>
              <ul className="mt-4 space-y-3">
                {botanical.benefits.map((b) => (
                  <li
                    key={b}
                    className="border-l-2 border-[#b8975c] pl-4 text-sm font-light text-charcoal/80"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section data-block-reveal="" className="section-aura border-t border-charcoal/10">
          <div className="container-aura">
            <Eyebrow tone="gold">In our formulas</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              Products using {botanical.name}
            </Display>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {related.length === 0 && (
              <Body muted className="mt-6">
                Explore the full shop while we expand this botanical’s shelf.
              </Body>
            )}
          </div>
        </section>

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura">
            <Eyebrow tone="gold">Explore more</Eyebrow>
            <div className="mt-6 flex flex-wrap gap-3">
              {botanicals
                .filter((b) => b.slug !== botanical.slug)
                .slice(0, 6)
                .map((b) => (
                  <Link
                    key={b.slug}
                    to={botanicalPath(b.slug)}
                    className="border border-charcoal/15 px-4 py-2 text-micro tracking-[0.12em] uppercase text-forest hover:border-forest"
                  >
                    {b.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

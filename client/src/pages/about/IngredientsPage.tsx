import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { EditorialHero } from '@components/content'
import { Body, Display, Eyebrow } from '@components/ui'
import {
  ingredientsHero,
  sourcingNote,
} from '@/data/about'
import { botanicals, botanicalPath } from '@/data/botanicals'
import {
  useGsap,
  revealCommerceBlocks,
  revealCommerceGrid,
} from '@animations/gsap'

export default function IngredientsPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="Ingredients"
        description="Discover the botanicals behind Aura of Nature — coffee, watermelon seed, turmeric, aloe, tea tree and more."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={ingredientsHero.eyebrow}
          title={ingredientsHero.title}
          description={ingredientsHero.description}
          image={ingredientsHero.image}
          imageAlt="Botanical ingredients"
        />

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {botanicals.map((ing) => (
              <Link
                key={ing.slug}
                to={botanicalPath(ing.slug)}
                data-product-card=""
                className="group"
              >
                <div className="relative aspect-square overflow-hidden bg-beige">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <Eyebrow className="mt-5">{ing.latin}</Eyebrow>
                <Display as="h2" size="sm" className="mt-1 text-forest">
                  {ing.name}
                </Display>
                <Body muted className="mt-2">
                  {ing.benefits[0]}
                </Body>
                <p className="mt-3 text-micro tracking-[0.14em] uppercase text-[#b8975c] opacity-0 transition-opacity group-hover:opacity-100">
                  View benefits →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          data-block-reveal=""
          className="section-aura border-t border-charcoal/10"
        >
          <div className="container-aura max-w-2xl">
            <Display as="h2" size="md" className="text-forest">
              {sourcingNote.title}
            </Display>
            <Body muted className="mt-5 leading-relaxed">
              {sourcingNote.body}
            </Body>
          </div>
        </section>
      </main>
    </>
  )
}

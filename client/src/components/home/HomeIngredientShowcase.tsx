import { Body, Display, Eyebrow } from '@components/ui'
import { showcaseIngredients } from '@/data/home'
import { useGsap, revealOnScroll, maskRevealImages, stickyStory } from '@animations/gsap'

export function HomeIngredientShowcase() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
    stickyStory(scope.current)
  }, [])

  return (
    <section ref={scope} className="bg-cream">
      <div className="container-aura py-[var(--spacing-section-sm)]">
        <Eyebrow data-reveal="">Ingredient showcase</Eyebrow>
        <Display data-reveal="" as="h2" size="lg" className="mt-3 max-w-xl text-forest">
          Scroll into the botanical
        </Display>
      </div>

      {showcaseIngredients.map((item) => (
        <article
          key={item.name}
          data-story-panel
          className="container-aura grid items-center gap-10 py-16 transition-opacity duration-500 lg:grid-cols-2 lg:gap-20 lg:py-24 [&:not(.is-active)]:lg:opacity-40"
        >
          <div data-reveal-image className="aspect-[5/4] overflow-hidden bg-beige">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain p-6"
              loading="lazy"
            />
          </div>
          <div>
            <Eyebrow tone="gold">{item.name}</Eyebrow>
            <Display as="h3" size="md" className="mt-4 text-forest">
              {item.name}
            </Display>
            <Body muted className="mt-5 max-w-md">
              {item.body}
            </Body>
          </div>
        </article>
      ))}
    </section>
  )
}

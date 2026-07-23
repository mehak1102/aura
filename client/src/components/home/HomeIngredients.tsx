import { Link } from 'react-router-dom'
import { Display, Eyebrow, Body } from '@components/ui'
import { ingredients } from '@/data/home'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'

export function HomeIngredients() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
  }, [])

  return (
    <section ref={scope} className="section-aura bg-beige/35">
      <div className="container-aura">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow data-reveal="">Shop by ingredient</Eyebrow>
            <Display data-reveal="" as="h2" size="lg" className="mt-4 text-forest">
              Meet the plants
            </Display>
          </div>
          <Body data-reveal="" muted className="max-w-sm md:text-right">
            Each formula begins with a single potent botanical — celebrated, not buried.
          </Body>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((item) => (
            <Link key={item.name} to={item.to} className="group block">
              <div data-reveal-image className="aspect-[3/4] overflow-hidden bg-cream">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 data-reveal="" className="font-display mt-4 text-2xl text-forest">
                {item.name}
              </h3>
              <p data-reveal="" className="mt-1 text-sm text-charcoal-muted">
                {item.benefit}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

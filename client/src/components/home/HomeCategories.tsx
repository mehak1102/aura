import { Link } from 'react-router-dom'
import { Display, Eyebrow } from '@components/ui'
import { categories } from '@/data/home'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomeCategories() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  return (
    <section ref={scope} className="section-aura-sm">
      <div className="container-aura">
        <Eyebrow data-reveal="">Shop by category</Eyebrow>
        <Display data-reveal="" as="h2" size="md" className="mt-3 text-forest">
          The full atelier
        </Display>

        <ul className="mt-12 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {categories.map((cat, i) => (
            <li key={cat.name} data-reveal="">
              <Link
                to={cat.to}
                className="group flex items-center justify-between gap-6 py-6 transition-colors hover:text-forest md:py-8"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-micro text-soft-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-3xl md:text-5xl">{cat.name}</span>
                </div>
                <span className="text-micro text-charcoal-muted">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

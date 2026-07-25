import { Link } from 'react-router-dom'
import { Display, Eyebrow, Body } from '@components/ui'
import { concerns } from '@/data/home'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomeConcerns() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  return (
    <section ref={scope} className="section-aura">
      <div className="container-aura">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow data-reveal="">Shop by concern</Eyebrow>
          <Display data-reveal="" as="h2" size="lg" className="mt-4 text-forest">
            What is your skin asking for?
          </Display>
          <Body data-reveal="" muted className="mt-4">
            Begin with the concern — we will meet you with botanicals that listen.
          </Body>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concerns.map((item) => (
            <Link
              key={item.label}
              data-reveal=""
              to={item.to}
              className="group flex items-center justify-between border border-charcoal/10 px-6 py-5 transition-colors duration-400 hover:border-forest hover:bg-beige/40"
            >
              <span className="font-display text-2xl text-charcoal group-hover:text-forest">
                {item.label}
              </span>
              <span className="text-micro text-olive opacity-70 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                Shop
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

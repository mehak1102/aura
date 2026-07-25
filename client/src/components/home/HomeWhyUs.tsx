import { Eyebrow, Display } from '@components/ui'
import { whyUs } from '@/data/home'
import { useGsap, animateCounters, revealOnScroll } from '@animations/gsap'

export function HomeWhyUs() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    animateCounters(scope.current)
  }, [])

  return (
    <section ref={scope} className="section-aura-sm border-y border-charcoal/10">
      <div className="container-aura">
        <div className="mb-12 text-center">
          <Eyebrow data-reveal="">Why choose us</Eyebrow>
          <Display data-reveal="" as="h2" size="md" className="mt-3 text-forest">
            Numbers with a pulse
          </Display>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {whyUs.map((stat) => (
            <div key={stat.label} data-reveal="" className="text-center">
              <p className="font-display text-4xl text-forest sm:text-5xl md:text-6xl">
                <span
                  data-counter={stat.value}
                  data-suffix={stat.suffix}
                  data-decimals={'decimals' in stat ? stat.decimals : 0}
                >
                  0{stat.suffix}
                </span>
              </p>
              <p className="mt-3 text-micro text-charcoal-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

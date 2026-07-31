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

        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5">
          {whyUs.map((stat) => {
            const content = (
              <>
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
              </>
            )

            if ('href' in stat && stat.href) {
              return (
                <a
                  key={stat.label}
                  href={stat.href}
                  target="_blank"
                  rel="noreferrer"
                  data-reveal=""
                  className="group text-center transition-opacity hover:opacity-80"
                  aria-label={`${stat.label} on Instagram`}
                >
                  {content}
                </a>
              )
            }

            return (
              <div key={stat.label} data-reveal="" className="text-center">
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

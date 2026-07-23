import { Body, Display, Eyebrow } from '@components/ui'
import { timeline } from '@/data/home'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomeTimeline() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'), {
      stagger: 0.15,
    })
  }, [])

  return (
    <section ref={scope} className="section-aura">
      <div className="container-aura">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow data-reveal="">Timeline</Eyebrow>
          <Display data-reveal="" as="h2" size="lg" className="mt-4 text-forest">
            A quiet evolution
          </Display>
        </div>

        <ol className="relative mx-auto mt-16 max-w-3xl space-y-12 before:absolute before:left-[0.55rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-charcoal/15 md:before:left-1/2 md:before:-translate-x-px">
          {timeline.map((item, i) => (
            <li
              key={item.year}
              data-reveal=""
              className={`relative grid gap-4 pl-10 md:grid-cols-2 md:gap-12 md:pl-0 ${
                i % 2 === 1 ? 'md:text-right' : ''
              }`}
            >
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-soft-gold md:left-1/2 md:-translate-x-1/2" />
              <div className={i % 2 === 1 ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}>
                <p className="text-micro text-olive">{item.year}</p>
                <h3 className="font-display mt-2 text-2xl text-forest">{item.title}</h3>
                <Body muted className="mt-3">
                  {item.body}
                </Body>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { Body, Display, Eyebrow } from '@components/ui'
import { philosophy } from '@/data/home'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomePhilosophy() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-forest py-[var(--spacing-section)] text-warm-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 10% 20%, rgba(184,151,92,0.2), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(90,107,72,0.35), transparent 50%)',
        }}
      />

      <div className="container-aura relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow data-reveal="" tone="gold">
            Brand philosophy
          </Eyebrow>
          <Display data-reveal="" as="h2" size="lg" className="mt-4 text-warm-white">
            Why Aura of Nature
          </Display>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {philosophy.map((item, i) => (
            <article key={item.title} data-reveal="" className="text-center md:text-left">
              <p className="text-micro text-soft-gold">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display mt-4 text-2xl md:text-3xl">{item.title}</h3>
              <Body className="mt-4 text-warm-white/70">{item.body}</Body>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Body, Display, Eyebrow, Input, MagneticButton } from '@components/ui'
import { useGsap, revealOnScroll } from '@animations/gsap'

export function HomeNewsletter() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])

  return (
    <section ref={scope} className="section-aura-sm">
      <div className="container-aura">
        <div className="relative overflow-hidden border border-charcoal/10 bg-gradient-to-br from-beige/60 via-warm-white to-cream px-8 py-14 md:px-16 md:py-20">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, rgba(184,151,92,0.35), transparent 70%)',
            }}
          />
          <div className="relative mx-auto max-w-xl text-center">
            <Eyebrow data-reveal="" tone="gold">
              Newsletter
            </Eyebrow>
            <Display data-reveal="" as="h2" size="md" className="mt-4 text-forest">
              Seasonal notes & early releases
            </Display>
            <Body data-reveal="" muted className="mt-4">
              Join the Aura circle for botanical stories and first access to limited batches.
            </Body>
            <form
              data-reveal=""
              className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row sm:items-end"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex-1">
                <Input
                  label="Email"
                  name="newsletter"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
              <MagneticButton type="submit" variant="primary">
                Subscribe
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

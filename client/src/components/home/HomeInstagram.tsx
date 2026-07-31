import { Display, Eyebrow } from '@components/ui'
import { instagram } from '@/data/home'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'

export function HomeInstagram() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
  }, [])

  return (
    <section ref={scope} className="section-aura-sm">
      <div className="container-aura">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow data-reveal="">Instagram</Eyebrow>
            <Display data-reveal="" as="h2" size="md" className="mt-3 text-forest">
              @auraofnatureofficial
            </Display>
          </div>
          <div data-reveal="">
            <a
              href="https://www.instagram.com/auraofnatureofficial/"
              target="_blank"
              rel="noreferrer"
              className="text-micro tracking-[0.22em] uppercase text-charcoal transition-colors hover:text-forest"
            >
              Follow the feed
            </a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {instagram.map((src, i) => (
            <a
              key={src}
              href="https://www.instagram.com/auraofnatureofficial/"
              target="_blank"
              rel="noreferrer"
              className="group block aspect-square overflow-hidden"
              aria-label={`Instagram image ${i + 1}`}
            >
              <div data-reveal-image className="h-full w-full bg-beige">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

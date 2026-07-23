import { Link } from 'react-router-dom'
import { Display, Eyebrow } from '@components/ui'
import { collections } from '@/data/home'
import { useGsap, horizontalPin } from '@animations/gsap'

export function HomeCollections() {
  const scope = useGsap(() => {
    if (!scope.current) return
    const track = scope.current.querySelector<HTMLElement>('[data-h-track]')
    if (track) horizontalPin(scope.current, track)
  }, [])

  return (
    <section ref={scope} className="relative bg-forest text-warm-white">
      <div className="container-aura pt-[var(--spacing-section-sm)] lg:absolute lg:inset-x-0 lg:top-16 lg:z-10">
        <Eyebrow tone="gold">Featured collections</Eyebrow>
        <Display as="h2" size="lg" className="mt-3 text-warm-white">
          Stay with the ritual
        </Display>
        <p className="mt-2 text-micro text-warm-white/50 lg:hidden">
          Scroll sideways on desktop
        </p>
      </div>

      <div
        data-h-track
        className="flex w-max gap-6 px-[var(--spacing-gutter)] pb-16 pt-10 lg:gap-8 lg:pb-24 lg:pt-48"
      >
        {collections.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group relative h-[60vh] w-[78vw] max-w-[420px] shrink-0 overflow-hidden md:w-[42vw] lg:h-[70vh] lg:w-[28vw]"
          >
            <img
              src={item.image}
              alt={item.title}
            className="h-full w-full object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-micro text-soft-gold">{item.subtitle}</p>
              <h3 className="font-display mt-2 text-3xl md:text-4xl">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

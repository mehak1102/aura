import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow } from '@components/ui'
import { concernPages, concernPath } from '@/data/concerns'
import { useGsap, revealCommerceBlocks, revealCommerceGrid } from '@animations/gsap'

export default function ConcernsIndexPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="Skin & hair concerns"
        description="Shop Aura rituals by concern — acne, pigmentation, hair fall, sensitive skin, and more."
      />
      <main ref={scope} className="pb-24 pt-28">
        <section data-block-reveal="" className="container-aura">
          <Eyebrow tone="gold">Skin concerns</Eyebrow>
          <Display as="h1" size="lg" className="mt-3 text-forest">
            Care matched to what you feel
          </Display>
          <Body muted className="mt-4 max-w-xl">
            Every concern page includes recommended products, a simple routine, and related reading.
          </Body>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {concernPages.map((concern) => (
              <Link
                key={concern.slug}
                to={concernPath(concern.slug)}
                className="group overflow-hidden border border-charcoal/10 bg-warm-white transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={concern.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <Eyebrow>{concern.eyebrow}</Eyebrow>
                  <h2 className="font-display mt-2 text-2xl text-forest">{concern.title}</h2>
                  <p className="mt-2 text-sm font-light text-charcoal/70">{concern.headline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

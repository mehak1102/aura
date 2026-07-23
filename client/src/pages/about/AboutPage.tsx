import { useNavigate } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { EditorialHero } from '@components/content'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import {
  aboutHero,
  aboutValues,
  aboutPillars,
  aboutChapters,
} from '@/data/about'
import { ROUTES } from '@/routes/paths'
import {
  useGsap,
  revealCommerceBlocks,
  revealCommerceGrid,
} from '@animations/gsap'

export default function AboutPage() {
  const navigate = useNavigate()

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="About"
        description="Aura of Nature — handcrafted botanical skincare rooted in Ayurvedic wisdom, transparency, and small-batch care."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={aboutHero.eyebrow}
          title={aboutHero.title}
          description={aboutHero.description}
          image={aboutHero.image}
          imageAlt="Aura of Nature botanical studio"
        />

        <section
          data-block-reveal=""
          className="section-aura border-t border-charcoal/10"
        >
          <div className="container-aura grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {aboutValues.map((value) => (
              <div key={value.title} data-product-card="">
                <Eyebrow>{value.title}</Eyebrow>
                <Body muted className="mt-3">
                  {value.body}
                </Body>
              </div>
            ))}
          </div>
        </section>

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>{aboutPillars.eyebrow}</Eyebrow>
              <Display as="h2" size="lg" className="mt-4 text-forest">
                {aboutPillars.title}
              </Display>
              <Body muted className="mt-6 max-w-md">
                {aboutPillars.body}
              </Body>
              <div className="mt-10">
                <MagneticButton
                  variant="outline"
                  onClick={() => navigate(aboutPillars.cta.to)}
                >
                  {aboutPillars.cta.label}
                </MagneticButton>
              </div>
            </div>
            <div className="relative aspect-[4/5] bg-beige">
              <img
                src={aboutPillars.image}
                alt="Botanical skincare preparation"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section data-block-reveal="" className="section-aura border-t border-charcoal/10">
          <div className="container-aura">
            <Eyebrow tone="gold">Inside Aura</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              Brand, craft & care
            </Display>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aboutChapters.map((chapter) => (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className="border border-charcoal/10 bg-warm-white p-7"
                >
                  <h3 className="font-display text-2xl text-forest">{chapter.title}</h3>
                  <Body muted className="mt-3">
                    {chapter.body}
                  </Body>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          data-block-reveal=""
          className="section-aura bg-forest text-cream"
        >
          <div className="container-aura text-center">
            <Display as="h2" size="md" className="text-cream">
              Ready to begin your ritual?
            </Display>
            <Body className="mx-auto mt-4 max-w-md text-cream/70">
              Explore our collections — skin, body, hair, and essential oils.
            </Body>
            <div className="mt-10">
              <MagneticButton
                variant="inverse"
                onClick={() => navigate(ROUTES.shop)}
              >
                Shop all products
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

import { Seo } from '@components/seo/Seo'
import { EditorialHero } from '@components/content'
import { Body, Display, Eyebrow } from '@components/ui'
import { storyHero, storyTimeline, storyQuote } from '@/data/about'
import { useGsap, revealCommerceBlocks } from '@animations/gsap'

export default function OurStoryPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="Our Story"
        description="From a kitchen table to your daily ritual — the Aura of Nature journey in small-batch botanical care."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={storyHero.eyebrow}
          title={storyHero.title}
          description={storyHero.description}
          image={storyHero.image}
          imageAlt="Aura of Nature origin story"
        />

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura max-w-3xl text-center">
            <Display as="p" size="md" italic className="text-forest">
              &ldquo;{storyQuote.text}&rdquo;
            </Display>
            <Body muted className="mt-6">
              — {storyQuote.author}
            </Body>
          </div>
        </section>

        <section
          data-block-reveal=""
          className="section-aura border-t border-charcoal/10"
        >
          <div className="container-aura">
            <Eyebrow>Timeline</Eyebrow>
            <Display as="h2" size="lg" className="mt-3 text-forest">
              Milestones along the way
            </Display>

            <div className="mt-14 space-y-0">
              {storyTimeline.map((item, index) => (
                <div
                  key={item.year}
                  className="grid gap-6 border-t border-charcoal/10 py-10 md:grid-cols-[120px_1fr]"
                >
                  <Eyebrow className="text-soft-gold">{item.year}</Eyebrow>
                  <div>
                    <Display as="h3" size="sm" className="text-forest">
                      {item.title}
                    </Display>
                    <Body muted className="mt-3 max-w-xl">
                      {item.body}
                    </Body>
                    {index < storyTimeline.length - 1 && (
                      <span className="sr-only">Next milestone</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

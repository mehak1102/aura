import { Seo } from '@components/seo/Seo'
import { EditorialHero, Accordion } from '@components/content'
import { Body } from '@components/ui'
import { faqCategories, faqHero } from '@/data/faq'
import { useGsap, revealCommerceBlocks } from '@animations/gsap'

export default function FaqPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about Aura of Nature orders, shipping, returns, products, and payments."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={faqHero.eyebrow}
          title={faqHero.title}
          description={faqHero.description}
        />

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura max-w-3xl space-y-16">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="mb-6 font-display text-2xl text-forest">
                  {category.title}
                </h2>
                <Accordion
                  items={category.items.map((item) => ({
                    title: item.question,
                    content: (
                      <Body muted className="leading-relaxed">
                        {item.answer}
                      </Body>
                    ),
                  }))}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

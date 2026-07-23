import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow } from '@components/ui'
import { giftSets, giftSetsHero } from '@/data/gifts'
import { useGsap, revealCommerceBlocks, revealCommerceGrid } from '@animations/gsap'

export default function GiftSetsPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [])

  return (
    <>
      <Seo title="Gift sets" description={giftSetsHero.description} />
      <main ref={scope} className="pb-24 pt-28">
        <section data-block-reveal="" className="container-aura max-w-3xl">
          <Eyebrow tone="gold">{giftSetsHero.eyebrow}</Eyebrow>
          <Display as="h1" size="lg" className="mt-3 text-forest">
            {giftSetsHero.title}
          </Display>
          <Body muted className="mt-4">
            {giftSetsHero.description}
          </Body>
        </section>

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid gap-8 md:grid-cols-2">
            {giftSets.map((gift) => (
              <Link
                key={gift.id}
                to={gift.to}
                className="group overflow-hidden border border-charcoal/10 bg-warm-white"
              >
                <div className="aspect-[16/11] overflow-hidden">
                  <img
                    src={gift.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <Eyebrow>{gift.eyebrow}</Eyebrow>
                  <h2 className="font-display mt-2 text-3xl text-forest">{gift.title}</h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/70">
                    {gift.body}
                  </p>
                  <p className="mt-5 text-micro tracking-[0.14em] uppercase text-[#b8975c]">
                    {gift.priceLabel}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

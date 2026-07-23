import { useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { EditorialHero } from '@components/content'
import { Body, Eyebrow } from '@components/ui'
import { storeHero, storeLocations } from '@/data/stores'
import { cn } from '@utils/index'
import { useGsap, revealCommerceBlocks } from '@animations/gsap'

export default function StoreLocatorPage() {
  const [active, setActive] = useState(storeLocations[0].id)

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
  }, [])

  const selected = storeLocations.find((s) => s.id === active) ?? storeLocations[0]

  return (
    <>
      <Seo
        title="Store Locator"
        description="Find an Aura of Nature studio — Bengaluru, Mumbai, Delhi, and Hyderabad."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={storeHero.eyebrow}
          title={storeHero.title}
          description={storeHero.description}
        />

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="relative min-h-[400px] overflow-hidden rounded-sm bg-beige">
              <iframe
                title="Store map"
                className="absolute inset-0 h-full w-full border-0 grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=14&output=embed`}
              />
            </div>

            <div>
              <Eyebrow>All locations</Eyebrow>
              <ul className="mt-6 space-y-3">
                {storeLocations.map((store) => (
                  <li key={store.id}>
                    <button
                      type="button"
                      onClick={() => setActive(store.id)}
                      className={cn(
                        'w-full rounded-sm border px-5 py-4 text-left transition-colors',
                        active === store.id
                          ? 'border-forest bg-cream'
                          : 'border-charcoal/10 hover:border-charcoal/25',
                      )}
                    >
                      <Body className="text-forest">{store.name}</Body>
                      <Body muted size="sm" className="mt-1">
                        {store.city}, {store.state}
                      </Body>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-4 border-t border-charcoal/10 pt-8">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                  <Body muted>
                    {selected.address}, {selected.city} {selected.pincode}
                  </Body>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                  <Body muted>{selected.phone}</Body>
                </div>
                <Body muted size="sm">
                  {selected.hours}
                </Body>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

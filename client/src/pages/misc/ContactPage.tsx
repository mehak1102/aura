import { Mail, MapPin, Phone } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { EditorialHero, ContactForm } from '@components/content'
import { Body, Eyebrow } from '@components/ui'
import { contactHero, contactInfo } from '@/data/stores'
import { useGsap, revealCommerceBlocks } from '@animations/gsap'

export default function ContactPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
  }, [])

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Aura of Nature — product questions, order support, and custom ritual advice."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={contactHero.eyebrow}
          title={contactHero.title}
          description={contactHero.description}
        />

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid gap-16 lg:grid-cols-2">
            <ContactForm />

            <div className="space-y-10">
              <div>
                <Eyebrow>Reach us</Eyebrow>
                <ul className="mt-6 space-y-5">
                  <li className="flex gap-4">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                    <div>
                      <Body className="text-forest">{contactInfo.email}</Body>
                      <Body muted size="sm">
                        General enquiries
                      </Body>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                    <div>
                      <Body className="text-forest">{contactInfo.support}</Body>
                      <Body muted size="sm">
                        Order support
                      </Body>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                    <div>
                      <Body className="text-forest">{contactInfo.phone}</Body>
                      <Body muted size="sm">
                        {contactInfo.hours}
                      </Body>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                    <div>
                      <Body className="text-forest">{contactInfo.address}</Body>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

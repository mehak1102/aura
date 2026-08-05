import {
  Headphones,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Sprout,
  TestTube,
  type LucideIcon,
} from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { ContactForm } from '@components/content'
import { Body, Display, Eyebrow, LeafShadows } from '@components/ui'
import { contactHero, contactInfo } from '@/data/stores'
import { useGsap, revealOnScroll } from '@animations/gsap'

const reachRows: { icon: LucideIcon; title: string; value: string; note?: string }[] = [
  { icon: Mail, title: 'General Enquiries', value: contactInfo.email },
  { icon: Headphones, title: 'Order Support', value: contactInfo.support },
  {
    icon: Phone,
    title: 'Call Us',
    value: contactInfo.phone,
    note: contactInfo.hours,
  },
  { icon: MapPin, title: 'Visit Us', value: contactInfo.address },
]

const assurances: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Leaf,
    title: 'Natural & Safe',
    body: 'Pure ingredients, safe for daily use',
  },
  {
    icon: TestTube,
    title: 'Clean Formulas',
    body: 'No harmful chemicals or additives',
  },
  {
    icon: Sprout,
    title: 'Sustainable',
    body: 'Ethical sourcing for a better planet',
  },
  {
    icon: Heart,
    title: 'Cruelty Free',
    body: 'We never test on animals',
  },
]

function LeafMark() {
  return (
    <svg viewBox="0 0 28 26" className="h-5 w-5 text-soft-gold" fill="none" aria-hidden>
      <path
        d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
        fill="currentColor"
      />
      <path
        d="M7.2 8.5C5.4 12.2 4.6 15.2 5.2 17.6a3.4 3.4 0 0 0 6.1 1.4C10.2 16.4 9.2 12.8 7.2 8.5Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M20.8 8.5C22.6 12.2 23.4 15.2 22.8 17.6a3.4 3.4 0 0 1-6.1 1.4C17.8 16.4 18.8 12.8 20.8 8.5Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

export default function ContactPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-page-reveal]'))
  }, [])

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Aura of Nature — product questions, order support, and custom ritual advice."
      />
      <main ref={scope} className="relative isolate overflow-hidden bg-[#faf6ef]">
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <section className="relative overflow-hidden">
          {/* Editorial photo — right side, soft-merged into cream */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block xl:w-[44%]"
          >
            <img
              src="/contact/contact-hero.png"
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, #faf6ef 0%, rgba(250,246,239,0.92) 14%, rgba(250,246,239,0.5) 38%, rgba(250,246,239,0.12) 66%, rgba(250,246,239,0) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#faf6ef] to-transparent" />
          </div>

          <div className="container-aura relative z-10 pt-28 pb-16 md:pt-32 md:pb-20">
            <div className="grid items-start gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-x-14">
              {/* Heading — left column, first row */}
              <div className="max-w-xl lg:col-start-1 lg:row-start-1">
                <Eyebrow data-page-reveal="" tone="gold">
                  {contactHero.eyebrow} us
                </Eyebrow>
                <Display
                  data-page-reveal=""
                  as="h1"
                  size="lg"
                  className="mt-3 text-forest"
                >
                  {contactHero.title}
                </Display>

                <div
                  data-page-reveal=""
                  className="mt-5 flex max-w-[14rem] items-center gap-3"
                  aria-hidden
                >
                  <LeafMark />
                  <span className="h-px flex-1 bg-soft-gold/50" />
                </div>
              </div>

              {/* Intro + form — aligns with the Reach us card */}
              <div className="max-w-xl lg:col-start-1 lg:row-start-2">
                <Body data-page-reveal="" muted className="max-w-md">
                  {contactHero.description}
                </Body>

                <div data-page-reveal="" className="mt-9">
                  <ContactForm />
                </div>
              </div>

              {/* Reach us — floating card */}
              <div
                data-page-reveal=""
                className="lg:col-start-2 lg:row-start-2 lg:mt-4"
              >
                <aside className="rounded-[26px] border border-white/70 bg-white/72 p-7 shadow-[0_24px_60px_rgba(23,55,40,0.09)] backdrop-blur-md md:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-soft-gold/30 bg-[#f6efe2]">
                    <LeafMark />
                  </span>

                  <Display as="h2" size="sm" className="mt-5 text-forest">
                    Reach us
                  </Display>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-12 bg-soft-gold/60"
                  />

                  <ul className="mt-6 divide-y divide-forest/8">
                    {reachRows.map(({ icon: Icon, title, value, note }) => (
                      <li key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-forest/10 bg-[#f6efe2] text-forest">
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[0.86rem] font-medium text-forest">
                            {title}
                          </p>
                          <p className="mt-1 text-[0.85rem] font-light leading-relaxed text-charcoal-muted">
                            {value}
                          </p>
                          {note && (
                            <p className="mt-0.5 text-[0.78rem] font-light text-charcoal-muted/80">
                              {note}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Assurance bar */}
        <section className="container-aura pb-20 md:pb-24">
          <div
            data-page-reveal=""
            className="rounded-2xl border border-forest/10 bg-white/70 px-6 py-7 shadow-[0_16px_44px_rgba(23,55,40,0.06)] backdrop-blur-sm md:px-8"
          >
            <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {assurances.map(({ icon: Icon, title, body }, i) => (
                <li
                  key={title}
                  className={
                    i > 0
                      ? 'flex gap-4 lg:border-l lg:border-forest/10 lg:pl-7'
                      : 'flex gap-4 lg:pr-7'
                  }
                >
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-soft-gold/45 bg-[#f2ece1] text-forest">
                    <Icon className="h-6 w-6" strokeWidth={1.4} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.88rem] font-medium text-forest">
                      {title}
                    </p>
                    <p className="mt-1 text-[0.8rem] font-light leading-relaxed text-charcoal-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}

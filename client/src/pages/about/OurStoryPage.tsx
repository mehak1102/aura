import type { ReactNode } from 'react'
import { Seo } from '@components/seo/Seo'
import { BentoHero } from '@components/content'
import { Body, Display, Eyebrow, LeafShadows } from '@components/ui'
import {
  storyBento,
  storyTimeline,
  storyQuote,
  whyAura,
  storyMission,
  storyPromises,
  type StoryMilestone,
  type StoryPromise,
} from '@/data/about'
import {
  useGsap,
  revealCommerceBlocks,
  revealTimeline,
  revealCardCascade,
  revealHeadingChars,
  revealTextLines,
  revealTextLinesFlip,
  revealTextWords,
  maskRevealImages,
} from '@animations/gsap'

const milestoneIcons: Record<StoryMilestone['icon'], ReactNode> = {
  mortar: (
    <>
      <path d="M6 10h12a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z" />
      <path d="M11 16v4h2v-4" />
      <path d="M14 9 18 4" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 20c0-6 3-10 8-11 0 6-3 10-8 11Z" />
      <path d="M12 20C9 15 6 13 4 13c1 4 4 6 8 7Z" />
      <path d="M12 20v-3" />
    </>
  ),
  dropper: (
    <>
      <path d="M10 3h4" />
      <path d="M11 3v3.5L9 9v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9l-2-2.5V3" />
      <path d="M9 13h6" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="2.6" />
      <circle cx="16.5" cy="10" r="2" />
      <path d="M4 19c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6" />
      <path d="M15 19c0-2.1 1.4-3.4 3-3.4 1.2 0 2 .5 2 1.4" />
    </>
  ),
}

function MilestoneIcon({ icon }: { icon: StoryMilestone['icon'] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {milestoneIcons[icon]}
    </svg>
  )
}

const promiseIcons: Record<StoryPromise['icon'], ReactNode> = {
  certified: (
    <>
      <circle cx="12" cy="10" r="6" />
      <path d="m9.5 10 1.8 1.8L15 8.4" />
      <path d="m9 16-1 5 4-2 4 2-1-5" />
    </>
  ),
  pure: (
    <>
      <path d="M12 3c3.2 4 5 6.8 5 9.2A5 5 0 0 1 7 12.2C7 9.8 8.8 7 12 3Z" />
      <path d="M12 17.5c1.7 0 3-1.1 3-2.6" />
    </>
  ),
  cruelty: (
    <>
      <path d="M8 8c-.8-2.4-.6-4.4.4-4.6 1-.2 2 1.4 2.3 3.6" />
      <path d="M16 8c.8-2.4.6-4.4-.4-4.6-1-.2-2 1.4-2.3 3.6" />
      <path d="M12 20c-3 0-5-1.8-5-4.5S9 8.5 12 8.5s5 4.3 5 7S15 20 12 20Z" />
      <path d="M10.5 14.5h3" />
    </>
  ),
  ayurvedic: (
    <>
      <path d="M12 4c1.8 2.6 2.6 4.8 2.6 6.6a2.6 2.6 0 0 1-5.2 0C9.4 8.8 10.2 6.6 12 4Z" />
      <path d="M5 13c2.6.5 4.4 1.6 5.4 3.2M19 13c-2.6.5-4.4 1.6-5.4 3.2" />
      <path d="M12 20v-3.5" />
    </>
  ),
  handcrafted: (
    <>
      <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10.5V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M14 11V7.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6H10a5 5 0 0 1-5-5v-2.5a1.5 1.5 0 0 1 3 0" />
    </>
  ),
  honest: (
    <>
      <path d="M4 5.5h6a2 2 0 0 1 2 2V20a2.5 2.5 0 0 0-2.5-2.5H4Z" />
      <path d="M20 5.5h-6a2 2 0 0 0-2 2V20a2.5 2.5 0 0 1 2.5-2.5H20Z" />
      <path d="M15 10.5h3M15 13.5h3" />
    </>
  ),
}

function PromiseIcon({ icon }: { icon: StoryPromise['icon'] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {promiseIcons[icon]}
    </svg>
  )
}

function LeafRule() {
  return (
    <div className="mx-auto mt-7 flex w-40 items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-soft-gold/45" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-soft-gold" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 20c0-6 3-10 8-11 0 6-3 10-8 11Z" />
        <path d="M12 20c-2-4-5-6-8-6 1 4 4 6 8 6Z" />
      </svg>
      <span className="h-px flex-1 bg-soft-gold/45" />
    </div>
  )
}

export default function OurStoryPage() {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealHeadingChars(scope.current)
    revealTextWords(scope.current)
    maskRevealImages(scope.current)
    revealTimeline(scope.current)
    revealCardCascade(scope.current, {
      grid: '[data-promise-grid]',
      card: '[data-promise-card]',
      stagger: 0.22,
    })
    const stopLines = revealTextLines(scope.current)
    const stopFlips = revealTextLinesFlip(scope.current)
    return () => {
      stopLines?.()
      stopFlips?.()
    }
  }, [])

  return (
    <>
      <Seo
        title="Our Story"
        description="From a kitchen table to your daily ritual — the Aura of Nature journey in small-batch botanical care."
      />
      <main ref={scope} className="relative isolate overflow-hidden bg-cream pb-24">
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <BentoHero
          eyebrow={storyBento.eyebrow}
          title={storyBento.title}
          description={storyBento.description}
          hint={storyBento.hint}
          images={storyBento.images}
        />

        <section className="section-aura-sm">
          <div className="container-aura">
            <figure className="grid items-center md:grid-cols-[minmax(0,0.56fr)_minmax(0,1fr)]">
              <div className="relative h-48 md:h-80 lg:h-[24rem]">
                {/* Masked so the photo dissolves into the page, no card edge */}
                <img
                  src={storyQuote.image}
                  alt=""
                  className="h-full w-full object-cover object-[72%_center] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,black_0%,black_38%,transparent_90%)] md:[mask-image:linear-gradient(to_right,black_0%,black_38%,transparent_90%)]"
                  loading="lazy"
                />
              </div>

              <blockquote className="px-2 text-center sm:px-8 md:-ml-16">
                <Display
                  as="p"
                  size="md"
                  italic
                  className="text-forest"
                  data-word-reveal=""
                >
                  <span className="mr-1 align-top font-display text-3xl text-soft-gold/70">
                    &ldquo;
                  </span>
                  {storyQuote.text}
                  <span className="ml-1 align-top font-display text-3xl text-soft-gold/70">
                    &rdquo;
                  </span>
                </Display>
                <LeafRule />
                <figcaption
                  className="mt-4 text-body-sm text-charcoal-muted"
                  data-word-reveal=""
                >
                  — {storyQuote.author}
                </figcaption>
              </blockquote>
            </figure>
          </div>
        </section>

        <section className="section-aura-sm">
          <div className="container-aura grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-16">
            <div>
              <Eyebrow tone="gold" data-line-reveal="">
                {whyAura.eyebrow}
              </Eyebrow>
              <Display
                as="h2"
                size="lg"
                className="mt-3 text-forest"
                data-char-reveal=""
              >
                {whyAura.title}
              </Display>
              <Body
                className="mt-5 max-w-xl text-body-lg"
                data-line-reveal=""
              >
                {whyAura.lead}
              </Body>
              <div className="mt-6 space-y-4">
                {whyAura.paragraphs.map((paragraph) => (
                  <Body
                    key={paragraph}
                    muted
                    className="max-w-xl"
                    data-line-reveal=""
                  >
                    {paragraph}
                  </Body>
                ))}
              </div>
            </div>

            <div
              data-reveal-image=""
              className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-beige lg:aspect-[3/4]"
            >
              <img
                src={whyAura.image}
                alt="Aura of Nature radiance face serum with its botanicals"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section-aura-sm">
          <div className="container-aura">
            <div className="rounded-[var(--radius-lg)] border border-soft-gold/20 bg-warm-white p-7 sm:p-10 lg:p-14">
              <div className="max-w-3xl">
                <Eyebrow tone="gold" data-line-reveal="">
                  {storyMission.eyebrow}
                </Eyebrow>
                <Display
                  as="h2"
                  size="md"
                  className="mt-3 text-forest"
                  data-line-reveal=""
                >
                  {storyMission.title}
                </Display>
                <div className="mt-6 space-y-4">
                  {storyMission.paragraphs.map((paragraph) => (
                    <Body key={paragraph} muted data-line-flip="">
                      {paragraph}
                    </Body>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-soft-gold/25 pt-8 sm:flex sm:items-end sm:justify-between sm:gap-10">
                <div>
                  {storyMission.closing.map((line) => (
                    <Display
                      key={line}
                      as="p"
                      size="sm"
                      italic
                      className="text-forest"
                      data-line-flip=""
                    >
                      {line}
                    </Display>
                  ))}
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 sm:mt-0">
                  {storyMission.founders.map((founder) => (
                    <li key={founder.name}>
                      <p
                        className="font-display text-xl text-forest"
                        data-line-flip=""
                      >
                        {founder.name}
                      </p>
                      <Eyebrow tone="gold" className="mt-1">
                        {founder.role}
                      </Eyebrow>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-aura-sm">
          <div className="container-aura">
            <div className="rounded-[var(--radius-lg)] border border-charcoal/10 bg-warm-white/60 p-5 sm:p-7 lg:p-8">
              <Eyebrow tone="gold" data-timeline-head="">
                Timeline
              </Eyebrow>
              <Display
                as="h2"
                size="md"
                className="mt-2 text-forest"
                data-timeline-head=""
              >
                Milestones along the way
              </Display>
              <span
                className="mt-4 block h-px w-24 bg-soft-gold/45"
                data-timeline-head=""
                aria-hidden
              />

              <ol className="relative mt-6 space-y-2.5" data-timeline="">
                {/* Rail runs through the centre of the badge column */}
                <span
                  aria-hidden
                  data-timeline-rail=""
                  className="absolute top-[3.125rem] bottom-[3.125rem] hidden w-px bg-soft-gold/30 sm:left-[5.75rem] sm:block"
                />

                {storyTimeline.map((item) => (
                  <li
                    key={item.year}
                    data-timeline-item=""
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[3.25rem_2.5rem_minmax(0,1fr)] sm:gap-5"
                  >
                    <Eyebrow tone="gold" className="hidden sm:block" aria-hidden>
                      {item.year}
                    </Eyebrow>

                    <span className="relative z-[1] flex h-10 w-10 items-center justify-center rounded-full border border-soft-gold/35 bg-warm-white text-soft-gold shadow-[0_8px_20px_rgba(36,53,40,0.08)]">
                      <MilestoneIcon icon={item.icon} />
                    </span>

                    <article className="flex items-stretch gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-charcoal/8 bg-warm-white p-3.5 sm:py-3.5 sm:pl-5 lg:h-[6.25rem]">
                      <div className="min-w-0 flex-1 self-center">
                        <Eyebrow tone="gold" className="sm:hidden">
                          {item.year}
                        </Eyebrow>
                        <Display
                          as="h3"
                          size="sm"
                          className="mt-1 text-forest sm:mt-0"
                        >
                          {item.title}
                        </Display>
                        <Body muted size="sm" className="mt-1 line-clamp-2 leading-snug">
                          {item.body}
                        </Body>
                      </div>

                      <div className="-my-3.5 -mr-3.5 hidden w-32 shrink-0 overflow-hidden bg-beige lg:block xl:w-40">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section-aura-sm">
          <div className="container-aura">
            <div className="text-center">
              <Eyebrow tone="gold" data-line-reveal="">
                Our promise
              </Eyebrow>
              <Display
                as="h2"
                size="lg"
                className="mt-3 text-forest"
                data-line-reveal=""
              >
                What every bottle stands for
              </Display>
            </div>

            <ul
              data-promise-grid=""
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {storyPromises.map((promise) => (
                <li
                  key={promise.title}
                  data-promise-card=""
                  className="rounded-[var(--radius-lg)] border border-charcoal/10 bg-warm-white p-6 transition-colors duration-500 hover:border-soft-gold/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-soft-gold/35 bg-cream text-soft-gold">
                    <PromiseIcon icon={promise.icon} />
                  </span>
                  <h3 className="mt-5 text-label text-forest">{promise.title}</h3>
                  <Body muted size="sm" className="mt-2.5">
                    {promise.body}
                  </Body>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}

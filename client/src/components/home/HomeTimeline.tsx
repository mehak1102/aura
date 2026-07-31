import { timeline } from '@/data/home'
import { useGsap, gsap, revealOnScroll, prefersReducedMotion } from '@animations/gsap'
import { cn } from '@utils/index'

function GoldFlourish({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 16"
      className={cn('h-3.5 w-10 text-[#C8A96A]', className)}
      fill="none"
    >
      <path
        d="M24 14 C18 14 14 10 14 6 C14 3 16 1 18 2 C16 4 17 8 24 8 C31 8 32 4 30 2 C32 1 34 3 34 6 C34 10 30 14 24 14 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M24 8 V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function LeafWatermark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 220"
      className={cn('pointer-events-none absolute text-[#C8A96A]', className)}
      fill="currentColor"
    >
      <g opacity="0.11">
        <path d="M100 20 C60 50 40 100 48 150 C70 130 90 90 100 50 C110 90 130 130 152 150 C160 100 140 50 100 20 Z" />
        <path
          d="M100 50 C100 90 100 130 100 170"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M100 80 C80 95 70 110 68 125"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M100 95 C120 108 130 122 132 138"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.45"
        />
      </g>
    </svg>
  )
}

function TimelineCopy({
  year,
  title,
  body,
  align,
}: {
  year: string
  title: string
  body: string
  align: 'left' | 'right'
}) {
  return (
    <div
      data-timeline-copy
      className={cn(
        'max-w-sm',
        align === 'left' ? 'md:ml-auto md:text-right' : 'md:mr-auto md:text-left',
      )}
    >
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#C8A96A]">
        {year}
      </p>
      <h3 className="mt-1.5 font-display text-[clamp(1.05rem,1.6vw,1.28rem)] leading-snug text-[#243528]">
        {title}
      </h3>
      <span
        aria-hidden
        className={cn('mt-2 block h-px w-8 bg-[#C8A96A]', align === 'left' && 'md:ml-auto')}
      />
      <p className="mt-2 text-[0.78rem] leading-relaxed text-[#625d56]">{body}</p>
    </div>
  )
}

function TimelineMedia({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      data-timeline-media
      className={cn(
        'overflow-hidden rounded-xl border border-[#C8A96A]',
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full object-cover"
      />
    </div>
  )
}

export function HomeTimeline() {
  const scope = useGsap(() => {
    if (!scope.current || prefersReducedMotion()) return

    const root = scope.current
    revealOnScroll(root.querySelectorAll('[data-reveal-header]'), {
      y: 28,
      stagger: 0.08,
      duration: 0.7,
    })

    const track = root.querySelector<HTMLElement>('[data-timeline-track]')
    const line = root.querySelector<HTMLElement>('[data-timeline-line]')
    const endMark = root.querySelector<HTMLElement>('[data-timeline-end]')
    const steps = root.querySelectorAll<HTMLElement>('[data-timeline-step]')
    if (!track || !line || !steps.length) return

    gsap.set(line, { scaleY: 0, transformOrigin: 'top center' })
    if (endMark) gsap.set(endMark, { opacity: 0, y: 8 })

    steps.forEach((step) => {
      gsap.set(step.querySelectorAll('[data-timeline-node]'), { scale: 0, opacity: 0 })
      gsap.set(step.querySelectorAll('[data-timeline-media]'), { y: 56, opacity: 0 })
      gsap.set(step.querySelectorAll('[data-timeline-copy]'), { y: 28, opacity: 0 })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top 78%',
        once: true,
      },
    })

    // 1) Center line draws down
    tl.to(line, {
      scaleY: 1,
      duration: 0.85,
      ease: 'power2.inOut',
    })

    if (endMark) {
      tl.to(
        endMark,
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.2',
      )
    }

    // 2–3) Each step: node → image rises from below → text flows in
    steps.forEach((step) => {
      const node = step.querySelectorAll('[data-timeline-node]')
      const media = step.querySelectorAll('[data-timeline-media]')
      const copy = step.querySelectorAll('[data-timeline-copy]')

      tl.to(
        node,
        { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' },
        '-=0.12',
      )
      tl.to(
        media,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.03,
        },
        '-=0.04',
      )
      tl.to(
        copy,
        {
          y: 0,
          opacity: 1,
          duration: 0.48,
          ease: 'power2.out',
          stagger: 0.04,
        },
        '-=0.28',
      )
    })
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[#F7F2EA] py-6 sm:py-8 lg:py-9"
    >
      <LeafWatermark className="-left-4 top-6 h-44 w-40 -rotate-12 sm:left-2 sm:h-52 sm:w-48" />
      <LeafWatermark className="-right-6 top-16 h-40 w-36 rotate-[16deg] sm:right-4 sm:h-48 sm:w-44" />
      <LeafWatermark className="bottom-8 right-8 hidden h-36 w-32 rotate-6 lg:block" />

      <div className="container-aura relative z-10">
        <header className="mx-auto max-w-2xl text-center">
          <p
            data-reveal-header=""
            className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#C8A96A]"
          >
            Timeline
          </p>
          <div data-reveal-header="" className="mt-3 flex justify-center">
            <GoldFlourish />
          </div>
          <h2
            data-reveal-header=""
            className="mt-2.5 font-display text-[clamp(1.55rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.02em] text-[#243528]"
          >
            A quiet evolution
          </h2>
          <div data-reveal-header="" className="mt-3 flex justify-center">
            <GoldFlourish />
          </div>
          <p
            data-reveal-header=""
            className="mx-auto mt-3 max-w-md text-[0.84rem] leading-relaxed text-[#6f6558]"
          >
            Rooted in tradition. Crafted for today. Here&apos;s how it all began.
          </p>
        </header>

        <div
          data-timeline-track
          className="relative mx-auto mt-6 max-w-3xl sm:mt-7"
        >
          {/* Center spine — draws on scroll */}
          <div
            data-timeline-line
            aria-hidden
            className="absolute left-4 top-2 bottom-7 w-px origin-top bg-[#C8A96A]/75 md:left-1/2 md:-translate-x-px"
          />
          <div
            data-timeline-end
            aria-hidden
            className="absolute bottom-0 left-4 -translate-x-1/2 md:left-1/2"
          >
            <GoldFlourish className="h-3 w-8" />
          </div>

          <ol className="relative space-y-5 sm:space-y-6 lg:space-y-7">
            {timeline.map((item, i) => {
              const imageLeft = i % 2 === 0

              return (
                <li key={item.year} data-timeline-step className="relative">
                  <span
                    data-timeline-node
                    aria-hidden
                    className="absolute left-4 top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#C8A96A] bg-[#F7F2EA] md:left-1/2"
                  />

                  {/* Mobile */}
                  <div className="flex flex-col gap-4 pl-10 md:hidden">
                    <TimelineMedia
                      src={item.image}
                      alt={item.imageAlt}
                      className="mx-auto w-full max-w-[11.5rem]"
                    />
                    <TimelineCopy
                      year={item.year}
                      title={item.title}
                      body={item.body}
                      align="right"
                    />
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid md:grid-cols-2 md:items-center md:gap-8 lg:gap-10">
                    {imageLeft ? (
                      <>
                        <div className="pr-5 lg:pr-8">
                          <TimelineMedia
                            src={item.image}
                            alt={item.imageAlt}
                            className="ml-auto w-full max-w-[11.5rem] lg:max-w-[12.5rem]"
                          />
                        </div>
                        <div className="pl-5 lg:pl-8">
                          <TimelineCopy
                            year={item.year}
                            title={item.title}
                            body={item.body}
                            align="right"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pr-5 lg:pr-8">
                          <TimelineCopy
                            year={item.year}
                            title={item.title}
                            body={item.body}
                            align="left"
                          />
                        </div>
                        <div className="pl-5 lg:pl-8">
                          <TimelineMedia
                            src={item.image}
                            alt={item.imageAlt}
                            className="mr-auto w-full max-w-[11.5rem] lg:max-w-[12.5rem]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

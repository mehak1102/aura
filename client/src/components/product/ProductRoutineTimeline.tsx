import { useGsap, gsap, prefersReducedMotion } from '@animations/gsap'

type RoutineStep = {
  step: string
  title: string
  body: string
  image?: string
  imageAlt?: string
}

type ProductRoutineTimelineProps = {
  steps: RoutineStep[]
}

const DEFAULT_IMAGES: Record<string, { src: string; alt: string }> = {
  Prep: {
    src: '/product-info/routine/01-prep.png',
    alt: 'Botanical bottle ready for your ritual',
  },
  Apply: {
    src: '/product-info/routine/02-apply.png',
    alt: 'Applying oil with a dropper',
  },
  Layer: {
    src: '/product-info/routine/03-layer.png',
    alt: 'Layering care into the skin',
  },
}

const ROUTINE_LEAF =
  'M60 8 C92 28 112 70 98 118 C84 148 60 156 60 156 C60 156 36 148 22 118 C8 70 28 28 60 8Z'

const ROUTINE_LEAVES: { className: string; rotate?: number }[] = [
  { className: 'absolute -left-8 top-6 h-40 w-32 opacity-[0.1] blur-[11px]', rotate: -18 },
  { className: 'absolute left-14 top-20 h-28 w-24 opacity-[0.07] blur-[10px]', rotate: 28 },
  { className: 'absolute -right-6 top-8 h-44 w-36 opacity-[0.1] blur-[12px]', rotate: 22 },
  { className: 'absolute right-12 top-24 h-32 w-28 opacity-[0.07] blur-[10px]', rotate: -30 },
  { className: 'absolute -left-4 bottom-8 h-36 w-28 opacity-[0.09] blur-[11px]', rotate: 14 },
  { className: 'absolute -right-2 bottom-6 h-40 w-32 opacity-[0.09] blur-[11px]', rotate: -16 },
]

function RoutineLeafShadows() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {ROUTINE_LEAVES.map((leaf, i) => (
        <svg
          key={i}
          className={leaf.className}
          viewBox="0 0 120 160"
          fill="#243528"
          style={
            leaf.rotate != null
              ? { transform: `rotate(${leaf.rotate}deg)` }
              : undefined
          }
        >
          <path d={ROUTINE_LEAF} />
        </svg>
      ))}
    </div>
  )
}

export function ProductRoutineTimeline({ steps }: ProductRoutineTimelineProps) {
  const scope = useGsap(() => {
    if (!scope.current || prefersReducedMotion()) return

    const root = scope.current
    const track = root.querySelector<HTMLElement>('[data-routine-track]')
    const lineH = root.querySelector<HTMLElement>('[data-routine-line-h]')
    const lineV = root.querySelector<HTMLElement>('[data-routine-line-v]')
    const items = root.querySelectorAll<HTMLElement>('[data-routine-step]')
    if (!track || !items.length) return

    if (lineH) gsap.set(lineH, { scaleX: 0, transformOrigin: 'left center' })
    if (lineV) gsap.set(lineV, { scaleY: 0, transformOrigin: 'top center' })

    items.forEach((item) => {
      gsap.set(item.querySelectorAll('[data-routine-node]'), { scale: 0, opacity: 0 })
      gsap.set(item.querySelectorAll('[data-routine-media]'), {
        y: 24,
        opacity: 0,
        scale: 0.96,
      })
      gsap.set(item.querySelectorAll('[data-routine-copy]'), { y: 28, opacity: 0 })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top 80%',
        end: 'bottom 15%',
        toggleActions: 'restart reverse restart reverse',
        invalidateOnRefresh: true,
      },
    })

    const desktop = window.matchMedia('(min-width: 768px)').matches
    const drawLine = desktop ? lineH : lineV
    if (drawLine) {
      tl.to(drawLine, {
        ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
        duration: 0.9,
        ease: 'power2.inOut',
      })
    }

    items.forEach((item) => {
      const node = item.querySelectorAll('[data-routine-node]')
      const media = item.querySelectorAll('[data-routine-media]')
      const copy = item.querySelectorAll('[data-routine-copy]')

      tl.to(
        node,
        { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(2)' },
        '-=0.1',
      )
      tl.to(
        media,
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' },
        '-=0.18',
      )
      tl.to(
        copy,
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        '-=0.28',
      )
    })
  }, [steps])

  return (
    <div
      ref={scope}
      className="section-aura relative overflow-hidden border-y border-charcoal/10 bg-[#f3efe6]/55"
    >
      <RoutineLeafShadows />
      <div className="container-aura relative z-[1]">
        <p className="text-micro tracking-[0.16em] uppercase text-[#b8975c]">
          Routine
        </p>
        <h2 className="font-display mt-3 text-3xl text-forest md:text-4xl">
          How it fits your day
        </h2>

        <div data-routine-track="" className="relative mt-14 md:mt-16">
          {/* Horizontal track — desktop */}
          <div
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[11px] hidden h-px md:block"
            aria-hidden
          >
            <div className="h-full w-full bg-[#b8975c]/25" />
            <div
              data-routine-line-h=""
              className="absolute inset-0 origin-left bg-[#b8975c]"
            />
          </div>

          {/* Vertical track — mobile */}
          <div
            className="pointer-events-none absolute bottom-4 left-[11px] top-4 w-px md:hidden"
            aria-hidden
          >
            <div className="h-full w-full bg-[#b8975c]/25" />
            <div
              data-routine-line-v=""
              className="absolute inset-0 origin-top bg-[#b8975c]"
            />
          </div>

          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((item) => {
              const fallback = DEFAULT_IMAGES[item.title]
              const src = item.image ?? fallback?.src
              const alt = item.imageAlt ?? fallback?.alt ?? item.title

              return (
                <li
                  key={item.step}
                  data-routine-step=""
                  className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
                >
                  <span
                    data-routine-node=""
                    className="relative z-[1] mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#b8975c] bg-[#f3efe6] md:mx-auto"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-[#b8975c]" />
                  </span>

                  <div className="min-w-0 flex-1 md:mt-8 md:w-full">
                    {src && (
                      <div
                        data-routine-media=""
                        className="mx-auto w-full max-w-[11.5rem] overflow-hidden rounded-xl border border-[rgba(23,55,40,0.08)] bg-[#ebe4d6] shadow-[0_10px_24px_rgba(23,55,40,0.05)] sm:max-w-[13rem] md:max-w-[12.5rem]"
                      >
                        <img
                          src={src}
                          alt={alt}
                          className="aspect-square h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}

                    <div data-routine-copy="" className="mt-5 md:mt-6">
                      <span className="text-micro tracking-[0.2em] text-[#b8975c]">
                        {item.step}
                      </span>
                      <h3 className="font-display mt-2 text-2xl text-forest">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-xs text-sm font-light leading-relaxed text-charcoal/75 md:mx-auto md:mt-3">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

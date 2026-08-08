import { useCallback, useEffect, useRef } from 'react'
import {
  gsap,
  MotionPathPlugin,
  prefersReducedMotion,
  registerGsap,
  ScrollTrigger,
} from '@animations/gsap'
import { botanicals } from '@/data/botanicals'
import { cn } from '@utils/index'

registerGsap()

const STOPS = [
  { key: 'initial', className: 'left-[58%] top-[18%] sm:left-[62%] sm:top-[16%]' },
  { key: 'second', className: 'left-[4%] top-[28%] sm:left-[8%] sm:top-[26%]' },
  { key: 'third', className: 'right-[4%] top-[40%] left-auto sm:right-[8%] sm:top-[38%]' },
  { key: 'fourth', className: 'left-[12%] top-[52%] sm:left-[18%] sm:top-[50%]' },
  { key: 'fifth', className: 'left-[72%] top-[64%] sm:left-[78%] sm:top-[62%]' },
  { key: 'sixth', className: 'left-[8%] top-[76%] sm:left-[14%] sm:top-[74%]' },
  {
    key: 'seventh',
    className: 'right-[6%] top-[84%] left-auto sm:right-[10%] sm:top-[82%]',
  },
] as const

/** One image per stop — traveler swaps to the stop it is heading toward */
const PATH_IMAGES = botanicals.slice(0, STOPS.length).map(
  (b) => b.image || '/ingredients-showcase/jojoba.png',
)

/**
 * Decorative MotionPath layer behind Ingredients page content.
 * Traveler moves between soft waypoint markers as the page scrolls,
 * swapping its image to match each upcoming stop.
 */
export function IngredientMotionPath() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const travelerImgRef = useRef<HTMLImageElement | null>(null)
  const imageIndexRef = useRef(0)
  const ctxRef = useRef<gsap.Context | null>(null)

  const setTravelerImage = useCallback((index: number) => {
    const img = travelerImgRef.current
    const src = PATH_IMAGES[index]
    if (!img || !src || imageIndexRef.current === index) return
    imageIndexRef.current = index
    img.src = src
  }, [])

  const createTimeline = useCallback(() => {
    const root = rootRef.current
    const box = boxRef.current
    if (!root || !box || prefersReducedMotion()) return

    ctxRef.current?.revert()
    ctxRef.current = null
    gsap.set(box, { clearProps: 'transform' })
    imageIndexRef.current = -1
    setTravelerImage(0)

    ctxRef.current = gsap.context(() => {
      const boxStartRect = box.getBoundingClientRect()
      const containers = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll('[data-motion-stop]:not([data-motion-start])'),
      )

      const points = containers.map((container) => {
        const marker =
          container.querySelector<HTMLElement>('[data-motion-marker]') ||
          container
        const r = marker.getBoundingClientRect()

        return {
          x: r.left + r.width / 2 - (boxStartRect.left + boxStartRect.width / 2),
          y: r.top + r.height / 2 - (boxStartRect.top + boxStartRect.height / 2),
        }
      })

      if (points.length < 2) return

      const lastIndex = PATH_IMAGES.length - 1

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector('[data-motion-start]'),
            start: 'clamp(top 70%)',
            endTrigger: root.querySelector('[data-motion-end]'),
            end: 'clamp(top 35%)',
            scrub: 0.25,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Switch to the upcoming stop's image as soon as we head toward it
              const idx = Math.min(
                lastIndex,
                Math.ceil(self.progress * lastIndex - 0.001),
              )
              setTravelerImage(Math.max(0, idx))
            },
          },
        })
        .to(box, {
          duration: 1,
          ease: 'none',
          motionPath: {
            path: points,
            curviness: 1.5,
            autoRotate: false,
          },
        })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [setTravelerImage])

  useEffect(() => {
    void MotionPathPlugin
    // Wait a frame so parent `main` has laid out full content height
    const id = requestAnimationFrame(() => createTimeline())

    const onResize = () => createTimeline()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', onResize)
      ctxRef.current?.revert()
      ctxRef.current = null
    }
  }, [createTimeline])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(36, 53, 40, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(36, 53, 40, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {STOPS.map((stop, index) => {
        const isStart = index === 0
        const markerSrc = PATH_IMAGES[index]

        return (
          <div
            key={stop.key}
            data-motion-stop=""
            data-motion-start={isStart ? '' : undefined}
            className={cn(
              'absolute flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-2xl border border-dashed border-soft-gold/30 sm:h-[7.5rem] sm:w-[7.5rem]',
              stop.className,
            )}
          >
            {isStart ? (
              <div
                ref={boxRef}
                className="relative z-10 h-[4.75rem] w-[4.75rem] overflow-hidden rounded-xl bg-[#faf6ef]/80 opacity-70 shadow-[0_12px_28px_rgba(36,53,40,0.1)] sm:h-[5.5rem] sm:w-[5.5rem]"
              >
                <img
                  ref={travelerImgRef}
                  src={PATH_IMAGES[0]}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                />
              </div>
            ) : (
              <div
                data-motion-marker=""
                className="h-[4.25rem] w-[4.25rem] overflow-hidden rounded-xl bg-[#ebe3d6]/55 opacity-45 sm:h-[5rem] sm:w-[5rem]"
              >
                {markerSrc ? (
                  <img
                    src={markerSrc}
                    alt=""
                    className="h-full w-full object-cover object-[70%_45%]"
                    loading="lazy"
                    draggable={false}
                  />
                ) : null}
              </div>
            )}
          </div>
        )
      })}

      <div data-motion-end="" className="absolute top-[88%] left-0 h-px w-px" />
    </div>
  )
}

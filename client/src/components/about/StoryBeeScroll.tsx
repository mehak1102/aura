import { useEffect, useRef } from 'react'
import {
  gsap,
  MotionPathPlugin,
  pathEase,
  prefersReducedMotion,
  registerGsap,
  ScrollTrigger,
} from '@animations/gsap'

const LEAF_ICON = '/story/tea-leaves.png?v=2'

/**
 * Scroll-scrubbed leaf icon along a tall SVG path —
 * soft background motion for the Our Story page.
 */
export function StoryBeeScroll() {
  const pathRef = useRef<SVGPathElement | null>(null)
  const motionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    registerGsap()
    void MotionPathPlugin

    const path = pathRef.current
    const motion = motionRef.current
    if (!path || !motion || prefersReducedMotion()) return

    let tween: gsap.core.Tween | null = null
    let cancelled = false

    const start = () => {
      if (cancelled) return

      gsap.set(motion, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 1,
      })

      let ease: string | ((p: number) => number) = 'none'
      try {
        ease = pathEase(path, { smooth: true })
      } catch {
        ease = 'none'
      }

      tween = gsap.to(motion, {
        scrollTrigger: {
          trigger: path,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
        duration: 10,
        ease,
        immediateRender: true,
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
      })

      ScrollTrigger.refresh()
    }

    const id = requestAnimationFrame(() => requestAnimationFrame(start))

    return () => {
      cancelled = true
      cancelAnimationFrame(id)
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1588.4 2762.3"
        className="absolute inset-0 h-full w-full opacity-60"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="rgba(184,151,92,0.4)"
          strokeWidth="5"
          strokeMiterlimit={10}
          strokeDasharray="8 12"
          vectorEffect="non-scaling-stroke"
          d="M37.5,31C32.5,41.2,52.3,122.6,358,237.2c222.1,69.8,610.9-11.5,861.3,82.5c236.4,88.8,340.3,257.8,323.7,416.2c-19.9,209.7-162.4,595.6-340.4,613.1c-106.6-36.6-174.3,34.9-127.1,196.4c-24.6,284.5-286.8,140-346.4,140c-182.9-15.9-269.3,213.5-155.7,344.2c118,135.7,31.2,223.3,392,144.9c158.4-34.4,182.2,81,177.4,136.5c-26.9,51.3-27.4,334.3-150.7,382.5c-112.9,44.1-263.8-30.3-397.7-64.7c-141.7-36.4-257.9,86.3-257.9,86.3"
        />
      </svg>

      <div
        ref={motionRef}
        className="absolute top-0 left-0 h-12 w-12 opacity-85 sm:h-14 sm:w-14"
        style={{
          backgroundColor: '#9caf88',
          WebkitMaskImage: `url(${LEAF_ICON})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${LEAF_ICON})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  )
}

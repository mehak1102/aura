import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, registerGsap, ScrollTrigger } from '@animations/gsap'
import { onLenisPause, onLenisResume, registerLenis } from '@/lib/lenisControl'

type SmoothScrollProps = {
  children: ReactNode
}

/** Lenis smooth scroll synced with GSAP ScrollTrigger (scrollerProxy — same as reference site). */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    // Lenis adds continuous scroll work — skip on touch devices for smoother feel
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    registerGsap()
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    registerLenis(lenis)

    // Required so CSS sticky + scrubbed timelines stay in sync with Lenis
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true })
        }
        return window.scrollY || document.documentElement.scrollTop
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const unsubPause = onLenisPause(() => {
      lenis.stop()
    })
    const unsubResume = onLenisResume(() => {
      lenis.start()
    })

    let resizeTimer: number
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', onResize)
    ScrollTrigger.refresh()

    return () => {
      unsubPause()
      unsubResume()
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      gsap.ticker.remove(update)
      lenis.destroy()
      registerLenis(null)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      ScrollTrigger.refresh()
    }
  }, [])

  return children
}

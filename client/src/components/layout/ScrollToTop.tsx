import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '@animations/gsap'
import { jumpToTop, scrollToSection } from '@/lib/lenisControl'

/**
 * Every route change starts at the top.
 * Anchor links (/page#section) still land on their target instead.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // Own scroll position so back/forward doesn't restore the previous offset
  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useEffect(() => {
    if (hash) {
      // Lazy routes mount a frame later, so the target may not exist yet
      const id = window.requestAnimationFrame(() => scrollToSection(hash))
      return () => window.cancelAnimationFrame(id)
    }

    jumpToTop()
    ScrollTrigger.refresh()
  }, [pathname, hash])

  return null
}

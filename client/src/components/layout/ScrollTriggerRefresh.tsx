import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '@animations/gsap'

/** Recalculate ScrollTrigger positions after route changes */
export function ScrollTriggerRefresh() {
  const { pathname } = useLocation()

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return null
}

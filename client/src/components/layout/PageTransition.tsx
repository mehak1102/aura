import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** Brief cream veil on route change */
export function PageTransition() {
  const location = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setShow(true)
    const t = window.setTimeout(() => setShow(false), 280)
    return () => window.clearTimeout(t)
  }, [location.pathname])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-loader)] bg-[#F8F5EE] transition-opacity duration-300"
      style={{ opacity: show ? 0.35 : 0 }}
    />
  )
}

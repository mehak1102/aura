import { useEffect, useState, type RefObject } from 'react'

type UseInViewOptions = {
  threshold?: number
  rootMargin?: string
  /** Assume visible until the first observer callback (above-the-fold). */
  initial?: boolean
}

/** True while `ref` intersects the viewport — use to pause off-screen motion. */
export function useInView(
  ref: RefObject<Element | null>,
  { threshold = 0.2, rootMargin, initial = false }: UseInViewOptions = {},
) {
  const [inView, setInView] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])

  return inView
}

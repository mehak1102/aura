type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void
}

type LenisListener = () => void

const pauseListeners = new Set<LenisListener>()
const resumeListeners = new Set<LenisListener>()

let lenisRef: LenisLike | null = null

/** Subscribe to Lenis pause requests (used by fullscreen Observer hero). */
export function onLenisPause(listener: LenisListener) {
  pauseListeners.add(listener)
  return () => {
    pauseListeners.delete(listener)
  }
}

/** Subscribe to Lenis resume requests. */
export function onLenisResume(listener: LenisListener) {
  resumeListeners.add(listener)
  return () => {
    resumeListeners.delete(listener)
  }
}

export function pauseLenis() {
  pauseListeners.forEach((listener) => listener())
}

export function resumeLenis() {
  resumeListeners.forEach((listener) => listener())
}

export function registerLenis(instance: LenisLike | null) {
  lenisRef = instance
}

/** Smooth-scroll via Lenis when available; falls back to native. */
export function scrollToSection(target: string | HTMLElement, offset = 0) {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target
  if (!el || !(el instanceof HTMLElement)) return

  if (lenisRef) {
    lenisRef.scrollTo(el, { offset, duration: 1.25 })
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Scroll to an absolute window Y position (used by pinned horizontal sections). */
export function scrollToY(y: number, duration = 1.15) {
  if (lenisRef) {
    lenisRef.scrollTo(y, { duration })
    return
  }
  window.scrollTo({ top: y, behavior: 'smooth' })
}

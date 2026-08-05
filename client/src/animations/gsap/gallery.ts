import { gsap, ScrollTrigger, Flip } from './core'

const DESKTOP = '(min-width: 1024px)'

/**
 * Bento gallery that zooms from a centred grid to a full-bleed frame while pinned.
 * Flip measures the `--final` layout, then plays that state change on scrub.
 * Desktop only — smaller screens keep the static stacked grid.
 */
export function expandBentoGallery(section: HTMLElement) {
  const grid = section.querySelector<HTMLElement>('[data-bento-grid]')
  if (!grid) return

  const items = grid.querySelectorAll<HTMLElement>('[data-bento-item]')
  const copy = section.querySelector<HTMLElement>('[data-bento-copy]')
  const veil = section.querySelector<HTMLElement>('[data-bento-veil]')
  if (!items.length) return

  let ctx: gsap.Context | null = null

  const build = () => {
    ctx?.revert()
    grid.classList.remove('bento-grid--final')
    if (!window.matchMedia(DESKTOP).matches) return

    ctx = gsap.context(() => {
      // Capture the end layout, then snap back so Flip can animate towards it
      grid.classList.add('bento-grid--final')
      const finalState = Flip.getState(items)
      grid.classList.remove('bento-grid--final')

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=110%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      timeline.add(Flip.to(finalState, { simple: true, ease: 'expoScale(1, 4)' }), 0)

      if (copy) {
        timeline.to(
          copy,
          { autoAlpha: 0, y: -40, ease: 'power1.in', duration: 0.35 },
          0,
        )
      }

      // The cream scrim only exists to make the copy readable — it leaves with it
      if (veil) {
        timeline.to(
          veil,
          { autoAlpha: 0, ease: 'power1.in', duration: 0.35 },
          0,
        )
      }

      return () => gsap.set(items, { clearProps: 'all' })
    })
  }

  build()

  // Flip stores pixel positions, so a resize needs a fresh measurement
  let resizeTimer = 0
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      build()
      ScrollTrigger.refresh()
    }, 200)
  }

  window.addEventListener('resize', onResize)

  // Late-arriving fonts or images can shift the grid after the first measurement
  const pending = document.readyState !== 'complete'
  if (pending) window.addEventListener('load', onResize, { once: true })

  return () => {
    window.clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    if (pending) window.removeEventListener('load', onResize)
    ctx?.revert()
  }
}

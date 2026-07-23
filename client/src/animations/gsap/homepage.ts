import { gsap, ScrollTrigger, prefersReducedMotion } from './core'

/**
 * Portal hero — static frame (no float, parallax, or scrub motion).
 */
export function animateHero(root: HTMLElement): (() => void) | void {
  const media = root.querySelector<HTMLElement>('[data-hero-media]')
  const mid = root.querySelector<HTMLElement>('[data-hero-mid]')
  const fore = root.querySelector<HTMLElement>('[data-hero-fore]')
  const title = root.querySelector<HTMLElement>('[data-hero-title]')
  const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]')

  // Clear any leftover transforms from prior HMR / older motion versions
  gsap.set([media, mid, fore, title, ...fades].filter(Boolean), {
    clearProps: 'transform,x,y,rotation,rotateX,rotateY,scale,opacity',
  })

  return
}

export function revealOnScroll(
  elements: Element | Element[] | NodeListOf<Element>,
  options: {
    y?: number
    duration?: number
    stagger?: number
    start?: string
  } = {},
) {
  if (prefersReducedMotion()) return

  const list =
    elements instanceof NodeList || Array.isArray(elements)
      ? Array.from(elements as ArrayLike<Element>)
      : [elements]

  if (!list.length) return

  const {
    y = 48,
    duration = 1,
    stagger = 0.1,
    start = 'top 85%',
  } = options

  gsap.fromTo(
    list,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: list[0],
        start,
        toggleActions: 'play none none none',
      },
    },
  )
}

export function maskRevealImages(root: HTMLElement) {
  if (prefersReducedMotion()) return

  root.querySelectorAll<HTMLElement>('[data-reveal-image]').forEach((el) => {
    const img = el.querySelector('img')
    gsap.set(el, { overflow: 'hidden' })
    if (img) gsap.set(img, { scale: 1.2 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      el,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 1.25, ease: 'power4.inOut' },
    )

    if (img) {
      tl.to(img, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
    }
  })
}

export function animateCounters(root: HTMLElement) {
  if (prefersReducedMotion()) return

  root.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter || 0)
    const suffix = el.dataset.suffix || ''
    const decimals = Number(el.dataset.decimals || 0)
    const obj = { val: 0 }

    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent =
          decimals > 0
            ? `${obj.val.toFixed(decimals)}${suffix}`
            : `${Math.floor(obj.val)}${suffix}`
      },
    })
  })
}

export function horizontalPin(section: HTMLElement, track: HTMLElement) {
  if (prefersReducedMotion()) return
  if (window.innerWidth < 1024) return

  const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

  gsap.to(track, {
    x: () => -getScroll(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${getScroll()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })
}

export function stickyStory(section: HTMLElement) {
  if (prefersReducedMotion()) return
  if (window.innerWidth < 1024) return

  const panels = section.querySelectorAll<HTMLElement>('[data-story-panel]')
  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActive(i),
      onEnterBack: () => setActive(i),
    })
  })

  function setActive(index: number) {
    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i === index)
    })
  }
}

export { ScrollTrigger }

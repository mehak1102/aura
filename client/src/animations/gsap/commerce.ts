import { gsap, ScrollTrigger, prefersReducedMotion } from './core'
import { revealOnScroll } from './homepage'

/** Page title / intro copy — shop, cart, checkout, PDP */
export function revealCommerceHeader(root: HTMLElement) {
  const items = root.querySelectorAll('[data-page-reveal]')
  if (items.length) {
    revealOnScroll(items, { y: 28, stagger: 0.1, duration: 0.85 })
  }
}

/** Product grid cards */
export function revealCommerceGrid(root: HTMLElement) {
  const cards = root.querySelectorAll('[data-product-card]')
  if (cards.length) {
    revealOnScroll(cards, {
      y: 36,
      stagger: 0.05,
      duration: 0.8,
      start: 'top 90%',
    })
  }
}

/**
 * Cards that arrive one at a time once their grid enters view. Triggering off
 * the grid (not the first card) keeps the cascade in step with what's on screen.
 */
export function revealCardCascade(
  root: HTMLElement,
  options: {
    grid: string
    card: string
    y?: number
    scale?: number
    stagger?: number
  },
) {
  if (prefersReducedMotion()) return

  const { grid: gridSelector, card: cardSelector } = options
  const { y = 56, scale = 0.94, stagger = 0.18 } = options

  const grid = root.querySelector<HTMLElement>(gridSelector)
  const cards = Array.from(root.querySelectorAll<HTMLElement>(cardSelector))
  if (!cards.length) return

  gsap.set(cards, { opacity: 0, y, scale })

  gsap.to(cards, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: 'power3.out',
    stagger,
    overwrite: 'auto',
    scrollTrigger: {
      trigger: grid ?? cards[0],
      start: 'top 88%',
      toggleActions: 'play none none none',
      once: true,
    },
  })

  requestAnimationFrame(() => ScrollTrigger.refresh())
}

/**
 * Ingredient cards — clear one-by-one cascade as the grid enters view.
 */
export function revealIngredientCascade(root: HTMLElement) {
  revealCardCascade(root, {
    grid: '[data-ingredient-grid]',
    card: '[data-ingredient-card]',
    y: 64,
    scale: 0.92,
    stagger: 0.2,
  })
}

/**
 * Story timeline — the rail draws itself downward, then each milestone
 * slides in behind it, one after another.
 */
export function revealTimeline(root: HTMLElement) {
  if (prefersReducedMotion()) return

  const list = root.querySelector<HTMLElement>('[data-timeline]')
  const rail = root.querySelector<HTMLElement>('[data-timeline-rail]')
  const head = Array.from(
    root.querySelectorAll<HTMLElement>('[data-timeline-head]'),
  )
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-timeline-item]'),
  )
  if (!list || !items.length) return

  gsap.set(items, { opacity: 0, y: 40 })
  if (head.length) gsap.set(head, { opacity: 0, y: 18 })
  if (rail) gsap.set(rail, { transformOrigin: 'top center', scaleY: 0 })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: list,
      start: 'top 78%',
      once: true,
    },
    defaults: { overwrite: 'auto' },
  })

  if (head.length) {
    timeline.to(head, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.08,
    })
  }

  if (rail) {
    timeline.to(
      rail,
      { scaleY: 1, duration: 0.9, ease: 'power2.inOut' },
      head.length ? '-=0.25' : 0,
    )
  }

  timeline.to(
    items,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.24,
    },
    rail ? '-=0.5' : 0,
  )

  requestAnimationFrame(() => ScrollTrigger.refresh())
}

/** Larger content blocks — PDP sections, cart summary */
export function revealCommerceBlocks(root: HTMLElement) {
  const blocks = root.querySelectorAll('[data-block-reveal]')
  if (blocks.length) {
    revealOnScroll(blocks, { y: 32, stagger: 0.12, duration: 0.9 })
  }
}

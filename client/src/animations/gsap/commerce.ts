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

/** Larger content blocks — PDP sections, cart summary */
export function revealCommerceBlocks(root: HTMLElement) {
  const blocks = root.querySelectorAll('[data-block-reveal]')
  if (blocks.length) {
    revealOnScroll(blocks, { y: 32, stagger: 0.12, duration: 0.9 })
  }
}

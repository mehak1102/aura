import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { Flip } from 'gsap/Flip'
import { ExpoScaleEase } from 'gsap/EasePack'

let registered = false

export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, Observer, Flip, ExpoScaleEase)
  registered = true
}

export { gsap, ScrollTrigger, Observer, Flip }

/** Split text into word/char spans for reveal animations (SplitText alternative) */
export function splitText(
  element: HTMLElement,
  type: 'words' | 'chars' = 'words',
) {
  const text = element.textContent ?? ''
  element.setAttribute('aria-label', text)
  element.textContent = ''

  const parts =
    type === 'chars'
      ? [...text]
      : text.split(/(\s+)/).filter((p) => p.length > 0)

  const spans: HTMLSpanElement[] = []

  parts.forEach((part) => {
    if (type === 'words' && /^\s+$/.test(part)) {
      element.appendChild(document.createTextNode(part))
      return
    }

    const outer = document.createElement('span')
    outer.style.display = 'inline-block'
    outer.style.overflow = 'hidden'
    outer.style.verticalAlign = 'top'

    const inner = document.createElement('span')
    inner.style.display = 'inline-block'
    inner.textContent = part === ' ' ? '\u00A0' : part
    inner.setAttribute('aria-hidden', 'true')

    outer.appendChild(inner)
    element.appendChild(outer)
    spans.push(inner)
  })

  return spans
}

/**
 * SplitText-like helper — chars + words from existing line blocks.
 * Expects `[data-hero-line]` children for line animation.
 */
export function splitHeroTitle(element: HTMLElement) {
  const lineNodes = Array.from(
    element.querySelectorAll<HTMLElement>('[data-hero-line]'),
  )
  const lines = lineNodes.length ? lineNodes : [element]
  const chars: HTMLElement[] = []
  const words: HTMLElement[] = []

  // Already split (Strict Mode / HMR) — reuse existing word nodes
  const existing = element.querySelectorAll<HTMLElement>('.hero-word')
  if (existing.length) {
    existing.forEach((w) => {
      words.push(w)
      w.querySelectorAll<HTMLElement>('span').forEach((ch) => chars.push(ch))
    })
    return { chars, words, lines }
  }

  const label = element.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  element.setAttribute('aria-label', label)

  lines.forEach((line) => {
    const text = line.textContent ?? ''
    line.textContent = ''
    line.style.display = 'block'
    line.style.perspective = '500px'

    const wordParts = text.split(/(\s+)/).filter((p) => p.length > 0)
    wordParts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        line.appendChild(document.createTextNode(part))
        return
      }

      const wordOuter = document.createElement('span')
      wordOuter.style.display = 'inline-block'
      wordOuter.style.whiteSpace = 'nowrap'
      wordOuter.className = 'hero-word'

      ;[...part].forEach((ch) => {
        const charEl = document.createElement('span')
        charEl.style.display = 'inline-block'
        charEl.style.willChange = 'transform'
        charEl.textContent = ch
        if (ch === '.') charEl.style.color = '#8a6f3f'
        charEl.setAttribute('aria-hidden', 'true')
        wordOuter.appendChild(charEl)
        chars.push(charEl)
      })

      line.appendChild(wordOuter)
      words.push(wordOuter)
    })
  })

  return { chars, words, lines }
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

import { gsap, ScrollTrigger, prefersReducedMotion } from './core'

/**
 * Wraps every character in its own inline-block span, keeping words intact so
 * the heading still wraps naturally. Re-running is safe (Strict Mode / HMR).
 */
function splitIntoChars(element: HTMLElement) {
  const existing = Array.from(
    element.querySelectorAll<HTMLElement>('[data-split-char]'),
  )
  if (existing.length) return existing

  const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  if (!text) return []

  element.setAttribute('aria-label', text)
  element.textContent = ''

  const chars: HTMLElement[] = []
  const words = text.split(' ')

  words.forEach((word, index) => {
    const wordEl = document.createElement('span')
    wordEl.dataset.splitWord = ''
    wordEl.style.display = 'inline-block'
    wordEl.style.whiteSpace = 'nowrap'

    for (const char of word) {
      const charEl = document.createElement('span')
      charEl.dataset.splitChar = ''
      charEl.style.display = 'inline-block'
      charEl.style.willChange = 'transform'
      charEl.setAttribute('aria-hidden', 'true')
      charEl.textContent = char
      wordEl.appendChild(charEl)
      chars.push(charEl)
    }

    element.appendChild(wordEl)
    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
  })

  return chars
}

/**
 * Wraps each word in its own span. Nested markup (decorative quote marks and
 * the like) is wrapped whole rather than split, so its styling survives.
 */
function splitIntoWords(element: HTMLElement) {
  const existing = Array.from(
    element.querySelectorAll<HTMLElement>('[data-split-unit]'),
  )
  if (existing.length) return existing

  const units: HTMLElement[] = []

  const makeUnit = () => {
    const unit = document.createElement('span')
    unit.dataset.splitUnit = ''
    unit.style.display = 'inline-block'
    unit.style.willChange = 'transform'
    return unit
  }

  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const unit = makeUnit()
      // Carried over so wrapping doesn't reset the child's own alignment
      unit.style.verticalAlign = getComputedStyle(node as Element).verticalAlign
      element.replaceChild(unit, node)
      unit.appendChild(node)
      units.push(unit)
      return
    }

    if (node.nodeType !== Node.TEXT_NODE) return

    const text = node.textContent?.replace(/\s+/g, ' ') ?? ''
    const words = text.split(' ').filter((word) => word.length > 0)
    if (!words.length) {
      if (text.length) node.textContent = ' '
      return
    }

    const fragment = document.createDocumentFragment()
    if (/^\s/.test(text)) fragment.appendChild(document.createTextNode(' '))

    words.forEach((word, index) => {
      const unit = makeUnit()
      unit.style.whiteSpace = 'nowrap'
      unit.textContent = word
      fragment.appendChild(unit)
      units.push(unit)
      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(' '))
      }
    })

    if (/\s$/.test(text)) fragment.appendChild(document.createTextNode(' '))
    element.replaceChild(fragment, node)
  })

  return units
}

/**
 * Splits copy into visual lines. Masked lines get an overflow-hidden wrapper so
 * they can slide out from behind it; unmasked lines stay open so 3D transforms
 * aren't clipped. Line breaks depend on rendered width, so the source text is
 * stashed for re-splitting later.
 */
function splitIntoLines(element: HTMLElement, masked: boolean) {
  const source =
    element.dataset.splitSource ??
    (element.dataset.splitSource = element.textContent ?? '')
  const text = source.replace(/\s+/g, ' ').trim()
  if (!text) return []

  element.textContent = ''

  const words = text.split(' ').map((word, index, all) => {
    const wordEl = document.createElement('span')
    wordEl.style.display = 'inline-block'
    wordEl.textContent = word
    element.appendChild(wordEl)
    if (index < all.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
    return wordEl
  })

  const rows: HTMLElement[][] = []
  let currentTop: number | null = null
  words.forEach((wordEl) => {
    const top = Math.round(wordEl.offsetTop)
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      rows.push([wordEl])
      currentTop = top
    } else {
      rows[rows.length - 1].push(wordEl)
    }
  })

  element.textContent = ''

  return rows.map((row) => {
    const line = document.createElement('span')
    line.dataset.splitLine = ''
    line.style.display = 'block'
    line.style.willChange = 'transform'

    row.forEach((wordEl, index) => {
      line.appendChild(wordEl)
      if (index < row.length - 1) {
        line.appendChild(document.createTextNode(' '))
      }
    })

    if (!masked) {
      element.appendChild(line)
      return line
    }

    const mask = document.createElement('span')
    mask.style.display = 'block'
    mask.style.overflow = 'hidden'
    // Keeps descenders (g, y, p) from being clipped by the mask
    mask.style.paddingBottom = '0.12em'
    mask.style.marginBottom = '-0.12em'
    mask.appendChild(line)
    element.appendChild(mask)
    return line
  })
}

type LineAnimator = (
  lines: HTMLElement[],
  block: HTMLElement,
  onEnter: () => void,
) => gsap.core.Tween

/**
 * Shared plumbing for line animations: builds the split, rebuilds it whenever
 * the width or a late-loading font changes where lines break, and jumps to the
 * resting state if the reveal already played.
 */
function buildLineReveal(
  root: HTMLElement,
  selector: string,
  masked: boolean,
  animate: LineAnimator,
  resting: gsap.TweenVars,
): (() => void) | void {
  if (prefersReducedMotion()) return

  const blocks = Array.from(root.querySelectorAll<HTMLElement>(selector))
  if (!blocks.length) return

  const tweens: gsap.core.Tween[] = []
  let played = false

  const build = () => {
    tweens.splice(0).forEach((tween) => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })

    blocks.forEach((block) => {
      const lines = splitIntoLines(block, masked)
      if (!lines.length) return

      // Past the reveal, re-splitting must not hide the copy again
      if (played) {
        gsap.set(lines, resting)
        return
      }

      tweens.push(
        animate(lines, block, () => {
          played = true
        }),
      )
    })
  }

  let disposed = false
  build()

  // Line breaks measured with fallback fonts shift once the webfont swaps in
  if (document.fonts && document.fonts.status !== 'loaded') {
    void document.fonts.ready.then(() => {
      if (disposed) return
      build()
      ScrollTrigger.refresh()
    })
  }

  let width = window.innerWidth
  const onResize = () => {
    if (disposed || window.innerWidth === width) return
    width = window.innerWidth
    build()
    ScrollTrigger.refresh()
  }

  window.addEventListener('resize', onResize)
  return () => {
    disposed = true
    window.removeEventListener('resize', onResize)
  }
}

/**
 * Copy marked `[data-line-reveal]` rises line by line from behind a mask.
 * Returns a cleanup for the listener that keeps the split in sync.
 */
export function revealTextLines(root: HTMLElement) {
  return buildLineReveal(
    root,
    '[data-line-reveal]',
    true,
    (lines, block, onEnter) =>
      gsap.from(lines, {
        yPercent: 100,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'expo.out',
        force3D: true,
        onComplete: () => gsap.set(lines, { clearProps: 'willChange,transform' }),
        scrollTrigger: { trigger: block, start: 'top 88%', once: true, onEnter },
      }),
    { yPercent: 0, opacity: 1 },
  )
}

/**
 * Copy marked `[data-line-flip]` swings each line up into place around a hinge
 * set behind the text, so the lines unfold in 3D as the block scrolls in.
 */
export function revealTextLinesFlip(root: HTMLElement) {
  return buildLineReveal(
    root,
    '[data-line-flip]',
    false,
    (lines, block, onEnter) => {
      block.style.perspective = '600px'
      return gsap.from(lines, {
        rotationX: -70,
        transformOrigin: '50% 50% -120px',
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        force3D: true,
        // Drop the promoted layers so text re-rasterises crisply when idle
        onComplete: () => gsap.set(lines, { clearProps: 'willChange,transform' }),
        scrollTrigger: { trigger: block, start: 'top 85%', once: true, onEnter },
      })
    },
    { rotationX: 0, opacity: 1, clearProps: 'transform' },
  )
}

/**
 * Copy marked `[data-word-reveal]` drops in word by word from above, each with
 * a small random tilt that springs back to straight.
 */
export function revealTextWords(root: HTMLElement) {
  if (prefersReducedMotion()) return

  const blocks = Array.from(
    root.querySelectorAll<HTMLElement>('[data-word-reveal]'),
  )
  if (!blocks.length) return

  blocks.forEach((block) => {
    const words = splitIntoWords(block)
    if (!words.length) return

    gsap.from(words, {
      y: -55,
      opacity: 0,
      rotation: () => gsap.utils.random(-40, 40),
      duration: 1,
      stagger: 0.055,
      ease: 'back.out(1.5)',
      force3D: true,
      onComplete: () => gsap.set(words, { clearProps: 'willChange,transform' }),
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        once: true,
      },
    })
  })

  requestAnimationFrame(() => ScrollTrigger.refresh())
}

/**
 * Headings marked `[data-char-roll]` roll in once, letter by letter, as if the
 * characters were printed on a drum turning towards the reader.
 */
export function rollHeadingChars(root: HTMLElement) {
  if (prefersReducedMotion()) return

  const headings = Array.from(
    root.querySelectorAll<HTMLElement>('[data-char-roll]'),
  )
  if (!headings.length) return

  headings.forEach((heading) => {
    const chars = splitIntoChars(heading)
    if (!chars.length) return

    // Hinge sits behind the text so letters swing on a drum, not in place
    const fontSize = parseFloat(getComputedStyle(heading).fontSize) || 32
    const depth = -Math.round(fontSize * 1.4)

    gsap.set(chars, { backfaceVisibility: 'hidden' })

    gsap.fromTo(
      chars,
      { rotationX: -90, opacity: 0 },
      {
        rotationX: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.028,
        ease: 'power3.out',
        // Per-character perspective, since the word wrappers would flatten a
        // perspective set on the heading itself
        transformPerspective: 700,
        transformOrigin: `50% 50% ${depth}px`,
        force3D: true,
        onComplete: () =>
          gsap.set(chars, { clearProps: 'willChange,transform' }),
      },
    )
  })
}

/**
 * Headings marked `[data-char-reveal]` settle in letter by letter as the block
 * scrolls through view — each character drops from a random offset and tilt.
 */
export function revealHeadingChars(root: HTMLElement) {
  if (prefersReducedMotion()) return

  const headings = Array.from(
    root.querySelectorAll<HTMLElement>('[data-char-reveal]'),
  )
  if (!headings.length) return

  headings.forEach((heading) => {
    const chars = splitIntoChars(heading)
    if (!chars.length) return

    gsap.fromTo(
      chars,
      {
        yPercent: () => gsap.utils.random(-130, 130),
        rotation: () => gsap.utils.random(-16, 16),
        opacity: 0,
      },
      {
        yPercent: 0,
        rotation: 0,
        opacity: 1,
        ease: 'back.out(1.3)',
        duration: 0.9,
        stagger: 0.035,
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%',
          end: 'top 45%',
          scrub: 1,
        },
      },
    )
  })

  requestAnimationFrame(() => ScrollTrigger.refresh())
}

import { gsap, prefersReducedMotion } from '@animations/gsap'
import type { LuxurySlide } from './types'

type TransitionTargets = {
  copy: HTMLElement
  image: HTMLElement
  preview?: HTMLElement
  dots: HTMLElement
}

type SlideTrackPayload = {
  /** Image that becomes the new featured (on next = current up-next) */
  main: string
  /** Image that becomes the new up-next peek */
  preview: string
  /** Title for the incoming up-next panel */
  previewTitle?: string
  /** Slide that becomes the new copy column */
  copySlide?: LuxurySlide
  /** 0-based index for the incoming copy */
  copyIndex?: number
}

const EASE_OUT = 'power3.out'
const EASE_IO = 'power2.inOut'
const TRACK_DUR = 0.85

function mainImg(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>('[data-main-image]')
}

function mainIncoming(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>('[data-main-incoming]')
}

function previewPanel(preview: HTMLElement) {
  return preview.querySelector<HTMLElement>('[data-preview-panel]')
}

function previewIncomingPanel(preview: HTMLElement) {
  return preview.querySelector<HTMLElement>('[data-preview-incoming-panel]')
}

function previewImg(preview: HTMLElement) {
  return preview.querySelector<HTMLImageElement>('[data-preview-image]')
}

function previewIncoming(preview: HTMLElement) {
  return preview.querySelector<HTMLImageElement>('[data-preview-incoming]')
}

function copyPanel(copy: HTMLElement) {
  return copy.querySelector<HTMLElement>('[data-copy-panel]')
}

function copyIncomingPanel(copy: HTMLElement) {
  return copy.querySelector<HTMLElement>('[data-copy-incoming-panel]')
}

function parkIncoming(el: HTMLElement | null) {
  if (!el) return
  gsap.set(el, {
    xPercent: 100,
    opacity: 0,
    visibility: 'hidden',
    force3D: true,
  })
}

/** Decode an image src so the track never slides in a blank frame. */
function ensureImageReady(img: HTMLImageElement | null, src: string): Promise<void> {
  if (!img || !src) return Promise.resolve()
  if (img.getAttribute('src') !== src) img.src = src
  if (img.complete && img.naturalWidth > 0) return Promise.resolve()
  return img.decode().catch(() => undefined)
}

/**
 * Warm the incoming layers before a click so up-next doesn't lag behind featured.
 */
export function primeIncomingMedia(
  targets: Pick<TransitionTargets, 'image' | 'preview'>,
  payload: Pick<SlideTrackPayload, 'main' | 'preview' | 'previewTitle'>,
): Promise<void> {
  const imgIn = mainIncoming(targets.image)
  const panelIn = targets.preview ? previewIncomingPanel(targets.preview) : null
  const pImgIn = targets.preview ? previewIncoming(targets.preview) : null
  const titleIn = targets.preview?.querySelector<HTMLElement>('[data-preview-incoming-title]')

  if (titleIn && payload.previewTitle) titleIn.textContent = payload.previewTitle

  return Promise.race([
    Promise.all([
      ensureImageReady(imgIn, payload.main),
      ensureImageReady(pImgIn, payload.preview),
    ]),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 100)
    }),
  ]).then(() => {
    // Keep parked — only bytes are warm
    parkIncoming(imgIn)
    parkIncoming(panelIn)
  })
}

function fillCopyPanel(panel: HTMLElement, slide: LuxurySlide, index: number) {
  const num = panel.querySelector<HTMLElement>('[data-copy-num]')
  const titleA = panel.querySelector<HTMLElement>('[data-copy-title-a]')
  const titleB = panel.querySelector<HTMLElement>('[data-copy-title-b]')
  const subtitle = panel.querySelector<HTMLElement>('[data-copy-subtitle]')
  const description = panel.querySelector<HTMLElement>('[data-copy-description]')
  const cta = panel.querySelector<HTMLAnchorElement>('[data-copy-cta]')
  const ctaLabel = panel.querySelector<HTMLElement>('[data-copy-cta-label]')

  if (num) num.textContent = String(index + 1).padStart(2, '0')

  if (slide.titleLines) {
    if (titleA) {
      titleA.textContent = slide.titleLines[0]
      titleA.classList.remove('hidden')
      titleA.classList.add('block', 'text-[clamp(2.4rem,4.2vw,3.75rem)]')
    }
    if (titleB) {
      titleB.textContent = slide.titleLines[1]
      titleB.classList.remove('hidden')
      titleB.classList.add('block', 'text-[clamp(2.4rem,4.2vw,3.75rem)]')
    }
  } else {
    if (titleA) {
      titleA.textContent = slide.title ?? ''
      titleA.classList.remove('hidden')
      titleA.classList.add('block')
    }
    if (titleB) {
      titleB.textContent = ''
      titleB.classList.add('hidden')
      titleB.classList.remove('block')
    }
  }

  if (subtitle) subtitle.textContent = slide.subtitle
  if (description) description.textContent = slide.description

  if (cta && ctaLabel) {
    if (slide.cta) {
      cta.href = slide.cta.to
      ctaLabel.textContent = slide.cta.label
      cta.classList.remove('hidden')
      cta.style.display = ''
    } else {
      cta.classList.add('hidden')
      cta.style.display = 'none'
    }
  }
}

/**
 * Continuous strip — copy, featured, and up-next all slide as one track.
 * No fade swap: the next frame pushes the current aside.
 *
 * direction 1  = next → track slides left  (2nd → 1st)
 * direction -1 = prev → track slides right
 */
export function animateSlideChange(
  targets: TransitionTargets,
  onSwap: () => void,
  direction: 1 | -1 = 1,
  payload?: SlideTrackPayload,
): gsap.core.Timeline {
  if (prefersReducedMotion()) {
    onSwap()
    return gsap.timeline()
  }

  const img = mainImg(targets.image)
  const imgIn = mainIncoming(targets.image)
  const pill = targets.image.querySelector<HTMLElement>('[data-feature-pill]')

  const panel = targets.preview ? previewPanel(targets.preview) : null
  const panelIn = targets.preview ? previewIncomingPanel(targets.preview) : null
  const pImg = targets.preview ? previewImg(targets.preview) : null
  const pImgIn = targets.preview ? previewIncoming(targets.preview) : null
  const titleIn = targets.preview?.querySelector<HTMLElement>('[data-preview-incoming-title]')
  const titleEl = targets.preview?.querySelector<HTMLElement>('[data-preview-title]')

  const cPanel = copyPanel(targets.copy)
  const cPanelIn = copyIncomingPanel(targets.copy)

  // Next: exit left / enter from right. Prev: opposite.
  const exitPct = direction * -100
  const enterPct = direction * 100

  if (panelIn && payload?.preview) {
    if (pImgIn) {
      if (pImgIn.getAttribute('src') !== payload.preview) pImgIn.src = payload.preview
    }
    if (titleIn && payload.previewTitle) titleIn.textContent = payload.previewTitle
    gsap.set(panelIn, {
      xPercent: enterPct,
      opacity: 1,
      visibility: 'visible',
      force3D: true,
    })
  }

  if (imgIn && payload?.main) {
    if (imgIn.getAttribute('src') !== payload.main) imgIn.src = payload.main
    gsap.set(imgIn, {
      xPercent: enterPct,
      opacity: 1,
      visibility: 'visible',
      force3D: true,
    })
  }

  if (cPanelIn && payload?.copySlide != null && payload.copyIndex != null) {
    fillCopyPanel(cPanelIn, payload.copySlide, payload.copyIndex)
    gsap.set(cPanelIn, {
      xPercent: enterPct,
      opacity: 1,
      visibility: 'visible',
      force3D: true,
    })
  }

  if (img) gsap.set(img, { xPercent: 0, opacity: 1, force3D: true })
  if (panel) gsap.set(panel, { xPercent: 0, opacity: 1, visibility: 'visible', force3D: true })
  if (cPanel) gsap.set(cPanel, { xPercent: 0, opacity: 1, visibility: 'visible', force3D: true })

  const tl = gsap.timeline({ defaults: { ease: EASE_IO } })

  // Soft chrome only — photos + copy stay fully opaque while tracking
  tl.to(targets.dots, { opacity: 0.35, duration: 0.28 }, 0)
  if (pill) tl.to(pill, { opacity: 0, y: 8, duration: 0.35, ease: 'power2.in' }, 0)

  // ——— Featured track ———
  if (img) {
    tl.to(img, { xPercent: exitPct, duration: TRACK_DUR, force3D: true }, 0)
  }
  if (imgIn) {
    tl.to(imgIn, { xPercent: 0, duration: TRACK_DUR, force3D: true }, 0)
  }

  // ——— Up-next box track ———
  if (panel) {
    tl.to(panel, { xPercent: exitPct, duration: TRACK_DUR, force3D: true }, 0)
  }
  if (panelIn) {
    tl.to(panelIn, { xPercent: 0, duration: TRACK_DUR, force3D: true }, 0)
  }

  // ——— Copy text track ———
  if (cPanel) {
    tl.to(cPanel, { xPercent: exitPct, duration: TRACK_DUR, force3D: true }, 0)
  }
  if (cPanelIn) {
    tl.to(cPanelIn, { xPercent: 0, duration: TRACK_DUR, force3D: true }, 0)
  }

  // ——— Commit once the track has landed ———
  tl.add(() => {
    if (img && payload?.main) img.src = payload.main
    if (pImg && payload?.preview) pImg.src = payload.preview
    if (titleEl && payload?.previewTitle) titleEl.textContent = payload.previewTitle
    if (cPanel && payload?.copySlide != null && payload.copyIndex != null) {
      fillCopyPanel(cPanel, payload.copySlide, payload.copyIndex)
    }

    if (img) gsap.set(img, { xPercent: 0, opacity: 1, force3D: true })
    if (panel) {
      gsap.set(panel, { xPercent: 0, opacity: 1, visibility: 'visible', force3D: true })
    }
    if (cPanel) {
      gsap.set(cPanel, { xPercent: 0, opacity: 1, visibility: 'visible', force3D: true })
    }
    parkIncoming(imgIn)
    parkIncoming(panelIn)
    parkIncoming(cPanelIn)

    onSwap()

    if (pill) gsap.set(pill, { opacity: 0, y: 8 })
  }, TRACK_DUR)

  tl.to(targets.dots, { opacity: 1, duration: 0.35, ease: EASE_OUT }, TRACK_DUR + 0.06)
  if (pill) {
    tl.to(pill, { opacity: 1, y: 0, duration: 0.45, ease: EASE_OUT }, TRACK_DUR + 0.04)
  }

  return tl
}

/** First paint — stage rises, product settles, preview slides in. */
export function animateSlideIntro(targets: TransitionTargets): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: EASE_OUT } })
  if (prefersReducedMotion()) return tl

  const img = mainImg(targets.image)
  const imgIn = mainIncoming(targets.image)
  const panel = targets.preview ? previewPanel(targets.preview) : null
  const panelIn = targets.preview ? previewIncomingPanel(targets.preview) : null
  const cPanel = copyPanel(targets.copy)
  const cPanelIn = copyIncomingPanel(targets.copy)

  parkIncoming(imgIn)
  parkIncoming(panelIn)
  parkIncoming(cPanelIn)

  if (img) {
    gsap.set(img, { scale: 1.06, opacity: 0, xPercent: 8, force3D: true })
  }
  if (cPanel) gsap.set(cPanel, { x: -28, opacity: 0 })
  gsap.set(targets.dots, { opacity: 0 })
  gsap.set(targets.image, { opacity: 0, x: 36 })
  if (targets.preview) gsap.set(targets.preview, { opacity: 0, x: 40 })
  if (panel) gsap.set(panel, { xPercent: 0, opacity: 1 })

  tl.to(
    targets.image,
    { opacity: 1, x: 0, duration: 0.85, force3D: true },
    0.05,
  )

  if (img) {
    tl.to(
      img,
      {
        scale: 1,
        opacity: 1,
        xPercent: 0,
        duration: 0.95,
        ease: EASE_OUT,
        force3D: true,
      },
      0.1,
    )
  }

  if (cPanel) {
    tl.to(cPanel, { x: 0, opacity: 1, duration: 0.7 }, 0.22)
  }

  if (targets.preview) {
    tl.to(targets.preview, { opacity: 1, x: 0, duration: 0.75 }, 0.32)
  }

  tl.to(targets.dots, { opacity: 1, duration: 0.4 }, 0.42)

  return tl
}

export function clearSlideStyles(targets: {
  copy?: HTMLElement | null
  image?: HTMLElement | null
  preview?: HTMLElement | null
  dots?: HTMLElement | null
}) {
  if (targets.copy) {
    const panel = copyPanel(targets.copy)
    const panelIn = copyIncomingPanel(targets.copy)
    if (panel) gsap.set(panel, { clearProps: 'all' })
    parkIncoming(panelIn)
  }
  if (targets.image) {
    gsap.set(targets.image, { clearProps: 'all' })
    const img = mainImg(targets.image)
    const imgIn = mainIncoming(targets.image)
    const pill = targets.image.querySelector<HTMLElement>('[data-feature-pill]')
    if (img) gsap.set(img, { clearProps: 'all' })
    parkIncoming(imgIn)
    if (pill) gsap.set(pill, { clearProps: 'all' })
  }
  if (targets.preview) {
    gsap.set(targets.preview, { clearProps: 'all' })
    const panel = previewPanel(targets.preview)
    const panelIn = previewIncomingPanel(targets.preview)
    if (panel) gsap.set(panel, { clearProps: 'all' })
    parkIncoming(panelIn)
  }
  if (targets.dots) gsap.set(targets.dots, { clearProps: 'all' })
}

import { gsap, prefersReducedMotion } from '@animations/gsap'

type TransitionTargets = {
  copy: HTMLElement
  image: HTMLElement
  preview?: HTMLElement
  dots: HTMLElement
}

const EASE_OUT = 'power3.out'
const EASE_IN = 'power2.in'
const EASE_IO = 'power2.inOut'

function mainImg(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>('[data-main-image]')
}

function previewImg(preview: HTMLElement) {
  return preview.querySelector<HTMLImageElement>('[data-preview-image]')
}

/**
 * Premium slide change — product drifts out with soft blur,
 * new product settles in from the opposite side.
 */
export function animateSlideChange(
  targets: TransitionTargets,
  onSwap: () => void,
  direction: 1 | -1 = 1,
): gsap.core.Timeline {
  if (prefersReducedMotion()) {
    onSwap()
    return gsap.timeline()
  }

  const parts = targets.copy.querySelectorAll('[data-slide-part]')
  const img = mainImg(targets.image)
  const pImg = targets.preview ? previewImg(targets.preview) : null

  const exitX = direction * -36
  const enterX = direction * 40

  const tl = gsap.timeline({ defaults: { ease: EASE_IO } })

  // ——— Exit ———
  tl.to(
    parts,
    { y: -14, opacity: 0, duration: 0.34, stagger: 0.03, ease: EASE_IN },
    0,
  )
  tl.to(targets.dots, { opacity: 0.35, duration: 0.22 }, 0)

  if (img) {
    tl.to(
      img,
      {
        x: exitX,
        y: 8,
        scale: 0.94,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.48,
        ease: EASE_IN,
        force3D: true,
      },
      0.04,
    )
  }

  if (targets.preview) {
    tl.to(
      targets.preview,
      { opacity: 0.25, x: direction * -8, duration: 0.36, ease: EASE_IN },
      0.06,
    )
  }
  if (pImg) {
    tl.to(pImg, { scale: 0.92, opacity: 0.4, duration: 0.36, ease: EASE_IN }, 0.06)
  }

  // ——— Swap mid-flight ———
  tl.add(() => {
    onSwap()
    if (img) {
      gsap.set(img, {
        x: enterX,
        y: 16,
        scale: 1.06,
        opacity: 0,
        filter: 'blur(10px)',
        force3D: true,
      })
    }
    if (pImg) {
      gsap.set(pImg, { scale: 1.08, opacity: 0, y: 12 })
    }
    if (targets.preview) {
      gsap.set(targets.preview, { x: direction * 12, opacity: 0 })
    }
  }, 0.5)

  // ——— Enter ———
  if (img) {
    tl.to(
      img,
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.78,
        ease: EASE_OUT,
        force3D: true,
      },
      0.52,
    )
  }

  if (targets.preview) {
    tl.to(
      targets.preview,
      { opacity: 1, x: 0, duration: 0.62, ease: EASE_OUT },
      0.58,
    )
  }
  if (pImg) {
    tl.to(
      pImg,
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT },
      0.6,
    )
  }

  tl.fromTo(
    parts,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.62, stagger: 0.045, ease: EASE_OUT },
    0.58,
  )
  tl.to(targets.dots, { opacity: 1, duration: 0.4, ease: EASE_OUT }, 0.62)

  return tl
}

/** First paint — stage rises, product settles, preview slides in. */
export function animateSlideIntro(targets: TransitionTargets): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: EASE_OUT } })
  if (prefersReducedMotion()) return tl

  const parts = targets.copy.querySelectorAll('[data-slide-part]')
  const img = mainImg(targets.image)
  const pImg = targets.preview ? previewImg(targets.preview) : null

  if (img) {
    gsap.set(img, { scale: 1.08, opacity: 0, y: 28, filter: 'blur(6px)', force3D: true })
  }
  gsap.set(parts, { y: 22, opacity: 0 })
  gsap.set(targets.dots, { opacity: 0 })
  if (targets.preview) gsap.set(targets.preview, { opacity: 0, x: 24 })
  if (pImg) gsap.set(pImg, { scale: 1.06, opacity: 0 })

  tl.fromTo(
    targets.image,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9 },
    0.05,
  )

  if (img) {
    tl.to(
      img,
      {
        scale: 1,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: EASE_OUT,
        force3D: true,
      },
      0.12,
    )
  }

  tl.to(parts, { y: 0, opacity: 1, duration: 0.72, stagger: 0.055 }, 0.28)

  if (targets.preview) {
    tl.to(targets.preview, { opacity: 1, x: 0, duration: 0.75 }, 0.38)
  }
  if (pImg) {
    tl.to(pImg, { scale: 1, opacity: 1, duration: 0.8 }, 0.42)
  }

  tl.to(targets.dots, { opacity: 1, duration: 0.45 }, 0.48)

  return tl
}

export function clearSlideStyles(targets: {
  copy?: HTMLElement | null
  image?: HTMLElement | null
  preview?: HTMLElement | null
  dots?: HTMLElement | null
}) {
  if (targets.copy) {
    gsap.set(targets.copy.querySelectorAll('[data-slide-part]'), { clearProps: 'all' })
  }
  if (targets.image) {
    gsap.set(targets.image, { clearProps: 'all' })
    const img = mainImg(targets.image)
    if (img) gsap.set(img, { clearProps: 'all' })
  }
  if (targets.preview) {
    gsap.set(targets.preview, { clearProps: 'all' })
    const pImg = previewImg(targets.preview)
    if (pImg) gsap.set(pImg, { clearProps: 'all' })
  }
  if (targets.dots) gsap.set(targets.dots, { clearProps: 'all' })
}

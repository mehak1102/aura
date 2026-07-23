import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { SlideContent } from './SlideContent'
import { animateSlideChange, animateSlideIntro, clearSlideStyles } from './transitions'
import type { LuxurySlide } from './types'

const AUTOPLAY_MS = 2000

type LuxurySliderProps = {
  slides: LuxurySlide[]
  className?: string
  eyebrow?: string
}

function slideLabel(slide: LuxurySlide) {
  return slide.imageAlt ?? slide.title ?? slide.titleLines?.join(' ') ?? 'Slide'
}

function previewTitle(slide: LuxurySlide) {
  return slide.titleLines?.join(' ') ?? slide.title ?? slide.imageAlt ?? 'Next'
}

function slideDirection(from: number, to: number, total: number): 1 | -1 {
  if (from === to) return 1
  const forward = (to - from + total) % total
  const backward = (from - to + total) % total
  return forward <= backward ? 1 : -1
}

/**
 * Atelier spotlight — warm linen field, luminous product stage, quiet up-next.
 */
export function LuxurySlider({
  slides,
  className = '',
  eyebrow = 'Botanical collection',
}: LuxurySliderProps) {
  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLButtonElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const activeRef = useRef(0)
  const busyRef = useRef(false)
  const goNextRef = useRef<() => void>(() => {})
  const inView = useInView(sectionRef, { threshold: 0.2 })

  const total = slides.length
  const slide = slides[active] ?? slides[0]
  const nextIndex = (active + 1) % total
  const upcoming = slides[nextIndex] ?? slide

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [slides])

  // Stop mid-flight transitions when the section leaves view
  useEffect(() => {
    if (inView) return
    timelineRef.current?.kill()
    timelineRef.current = null
    busyRef.current = false
    setBusy(false)
    if (copyRef.current && imageRef.current && dotsRef.current) {
      clearSlideStyles({
        copy: copyRef.current,
        image: imageRef.current,
        preview: previewRef.current ?? undefined,
        dots: dotsRef.current,
      })
    }
  }, [inView])

  useEffect(() => {
    if (!copyRef.current || !imageRef.current || !dotsRef.current) return
    if (prefersReducedMotion()) return

    const targets = {
      copy: copyRef.current,
      image: imageRef.current,
      preview: previewRef.current ?? undefined,
      dots: dotsRef.current,
    }

    const intro = animateSlideIntro(targets)
    intro.eventCallback('onComplete', () => clearSlideStyles(targets))

    const failsafe = window.setTimeout(() => clearSlideStyles(targets), 2000)

    return () => {
      window.clearTimeout(failsafe)
      intro.kill()
      clearSlideStyles(targets)
    }
  }, [])

  const goTo = useCallback(
    (index: number) => {
      if (!total || busyRef.current) return
      const next = ((index % total) + total) % total
      if (next === activeRef.current) return

      if (!copyRef.current || !imageRef.current || !dotsRef.current) {
        activeRef.current = next
        setActive(next)
        return
      }

      if (prefersReducedMotion()) {
        activeRef.current = next
        setActive(next)
        return
      }

      busyRef.current = true
      setBusy(true)
      timelineRef.current?.kill()

      const direction = slideDirection(activeRef.current, next, total)
      let settled = false

      const settle = () => {
        if (settled) return
        settled = true
        busyRef.current = false
        setBusy(false)
        timelineRef.current = null
      }

      timelineRef.current = animateSlideChange(
        {
          copy: copyRef.current,
          image: imageRef.current,
          preview: previewRef.current ?? undefined,
          dots: dotsRef.current,
        },
        () => {
          activeRef.current = next
          setActive(next)
        },
        direction,
      )

      timelineRef.current.eventCallback('onComplete', settle)
      timelineRef.current.eventCallback('onInterrupt', settle)
      window.setTimeout(settle, 1800)
    },
    [total],
  )

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    goNextRef.current = goNext
  }, [goNext])

  // Steady autoplay while in view — keeps moving even on hover
  useEffect(() => {
    if (!inView || prefersReducedMotion() || total < 2) return
    const timer = window.setInterval(() => {
      if (busyRef.current) return
      goNextRef.current()
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [inView, total])

  useEffect(() => {
    if (!inView) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, inView])

  useEffect(() => () => { timelineRef.current?.kill() }, [])

  if (!total) return null

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured rituals"
      className={`relative overflow-hidden bg-warm-white ${className}`}
    >
      {/* Linen atmosphere — light, not forest wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #faf8f4 0%, #f4efe6 42%, #ebe3d4 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 50% 55% at 78% 40%, rgba(184,151,92,0.12), transparent 62%), radial-gradient(ellipse 40% 45% at 12% 70%, rgba(90,107,72,0.08), transparent 58%)',
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-25" />

      {/* Soft forest accent edge — brand signal without filling the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-1.5 bg-gradient-to-b from-forest via-olive to-soft-gold lg:block"
      />

      <div className="container-aura relative grid min-h-[min(88vh,920px)] items-center gap-10 py-16 lg:grid-cols-[minmax(280px,0.9fr)_1.4fr] lg:gap-14 lg:py-20">
        <SlideContent
          ref={copyRef}
          slide={slide}
          eyebrow={eyebrow}
          index={active}
          total={total}
          dotsRef={dotsRef}
          onPrev={goPrev}
          onNext={goNext}
          onSelect={goTo}
          disabled={busy}
        />

        {/* One atelier stage: product + up-next share a single luminous panel */}
        <div className="relative flex min-h-[min(48vh,480px)] flex-col overflow-hidden sm:flex-row lg:min-h-[min(58vh,580px)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(145deg, #e8dfd0 0%, #f4efe6 45%, #ebe4d6 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[50%] h-[42%] w-[70%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(184,151,92,0.22),transparent_70%)]"
          />

          <div
            ref={imageRef}
            className="relative z-10 flex min-h-[min(40vh,400px)] flex-1 items-center justify-center p-6 sm:min-h-0 sm:flex-[1.85] sm:p-8 lg:p-12"
          >
            <img
              data-main-image
              src={slide.image}
              alt={slideLabel(slide)}
              className="mx-auto h-auto max-h-[min(46vh,480px)] w-full object-contain will-change-transform drop-shadow-[0_28px_50px_rgba(36,53,40,0.14)]"
              loading="eager"
              draggable={false}
            />
          </div>

          <button
            ref={previewRef}
            type="button"
            aria-label={`Up next: ${previewTitle(upcoming)}`}
            onClick={goNext}
            disabled={busy || total < 2}
            className="group relative z-10 flex w-full shrink-0 flex-row items-center gap-4 border-t border-forest/10 bg-warm-white/40 px-4 py-4 text-left backdrop-blur-[2px] transition-colors duration-300 hover:bg-warm-white/60 disabled:opacity-50 sm:w-[clamp(110px,28%,200px)] sm:flex-col sm:items-stretch sm:gap-0 sm:border-t-0 sm:border-l sm:px-4 sm:py-5"
          >
            <div className="min-w-0 flex-1 sm:flex-none">
              <p className="text-[0.52rem] font-semibold tracking-[0.34em] uppercase text-forest/40">
                Up next
              </p>
              <p className="mt-1.5 font-display text-[0.72rem] uppercase leading-snug tracking-wide text-forest/70 sm:mt-2 sm:text-[0.75rem]">
                {previewTitle(upcoming)}
              </p>
            </div>
            <div className="flex shrink-0 items-center justify-center sm:mt-auto sm:flex-1 sm:pt-4">
              <img
                data-preview-image
                src={upcoming.image}
                alt=""
                className="max-h-20 w-auto max-w-[5.5rem] object-contain will-change-transform transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.05] sm:max-h-[min(28vh,240px)] sm:max-w-full sm:w-full"
                draggable={false}
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Droplets, Leaf, Menu } from 'lucide-react'
import { Logo } from '@components/ui/Logo'
import { prefersReducedMotion } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { SlideContent } from './SlideContent'
import { animateSlideChange, animateSlideIntro, clearSlideStyles, primeIncomingMedia } from './transitions'
import type { LuxurySlide } from './types'

const AUTOPLAY_MS = 2000

const DEFAULT_FEATURES: [string, string, string] = [
  'Natural Ingredients',
  'Deep Nourishment',
  'Dermatologically Tested',
]

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
 * Ritual Edit — editorial three-column: rail, copy, featured card, up-next.
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
  const previewRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const activeRef = useRef(0)
  const busyRef = useRef(false)
  const goNextRef = useRef<() => void>(() => {})
  const hoverPausedRef = useRef(false)
  const inView = useInView(sectionRef, { threshold: 0.2 })

  const total = slides.length
  const slide = slides[active] ?? slides[0]
  const nextIndex = (active + 1) % total
  const upcoming = slides[nextIndex] ?? slide
  const features = slide.features ?? DEFAULT_FEATURES
  const slideNum = String(active + 1).padStart(2, '0')
  const totalNum = String(total).padStart(2, '0')

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [slides])

  // Keep the next up-next frame decoded so it doesn't lag behind the featured track
  useEffect(() => {
    if (!imageRef.current || total < 2) return
    const nextMain = (active + 1) % total
    const nextPeek = (active + 2) % total
    void primeIncomingMedia(
      {
        image: imageRef.current,
        preview: previewRef.current ?? undefined,
      },
      {
        main: slides[nextMain]?.image ?? '',
        preview: slides[nextPeek]?.image ?? '',
        previewTitle: previewTitle(slides[nextPeek] ?? slides[nextMain] ?? slides[0]),
      },
    )
  }, [active, slides, total])

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
      const nextPreview = (next + 1) % total
      let settled = false

      const targets = {
        copy: copyRef.current,
        image: imageRef.current,
        preview: previewRef.current ?? undefined,
        dots: dotsRef.current,
      }

      const payload = {
        main: slides[next]?.image ?? '',
        preview: slides[nextPreview]?.image ?? '',
        previewTitle: previewTitle(slides[nextPreview] ?? slides[next] ?? slides[0]),
        copySlide: slides[next],
        copyIndex: next,
      }

      const settle = () => {
        if (settled) return
        settled = true
        busyRef.current = false
        setBusy(false)
        timelineRef.current = null
        clearSlideStyles(targets)
      }

      const start = () => {
        if (settled || !busyRef.current) return
        timelineRef.current = animateSlideChange(
          targets,
          () => {
            activeRef.current = next
            setActive(next)
          },
          direction,
          payload,
        )
        timelineRef.current.eventCallback('onComplete', settle)
        timelineRef.current.eventCallback('onInterrupt', settle)
        window.setTimeout(settle, 1800)
      }

      // Decode up-next (and featured) before the track moves — avoids a late image pop-in
      void primeIncomingMedia(targets, payload).then(start)
    },
    [total, slides],
  )

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    goNextRef.current = goNext
  }, [goNext])

  useEffect(() => {
    if (!inView || prefersReducedMotion() || total < 2) return
    const timer = window.setInterval(() => {
      if (busyRef.current || hoverPausedRef.current) return
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
      className={`relative flex h-auto min-h-0 flex-col overflow-hidden bg-[#f4efe6] lg:h-[calc(100svh-4.5rem)] ${className}`}
    >
      {/* Soft leaf shadows on cream stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <svg
          className="absolute -right-[8%] -top-[12%] h-[78%] w-[58%] opacity-[0.11]"
          viewBox="0 0 520 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#243528">
            <ellipse cx="310" cy="90" rx="28" ry="72" transform="rotate(28 310 90)" />
            <ellipse cx="360" cy="130" rx="24" ry="64" transform="rotate(48 360 130)" />
            <ellipse cx="250" cy="150" rx="22" ry="58" transform="rotate(8 250 150)" />
            <ellipse cx="400" cy="200" rx="26" ry="70" transform="rotate(62 400 200)" />
            <ellipse cx="290" cy="230" rx="20" ry="54" transform="rotate(34 290 230)" />
            <ellipse cx="340" cy="280" rx="30" ry="78" transform="rotate(18 340 280)" />
            <ellipse cx="420" cy="320" rx="22" ry="60" transform="rotate(52 420 320)" />
            <ellipse cx="270" cy="340" rx="18" ry="50" transform="rotate(-6 270 340)" />
            <ellipse cx="370" cy="390" rx="26" ry="68" transform="rotate(40 370 390)" />
            <ellipse cx="310" cy="450" rx="24" ry="62" transform="rotate(14 310 450)" />
            <ellipse cx="390" cy="500" rx="20" ry="56" transform="rotate(56 390 500)" />
            <ellipse cx="330" cy="560" rx="22" ry="58" transform="rotate(26 330 560)" />
            <path
              d="M300 70c40 90 55 190 48 300"
              stroke="#243528"
              strokeWidth="3"
              fill="none"
              opacity="0.45"
            />
          </g>
        </svg>
        <svg
          className="absolute -bottom-[10%] -left-[4%] h-[55%] w-[42%] opacity-[0.08]"
          viewBox="0 0 420 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#243528">
            <ellipse cx="120" cy="320" rx="26" ry="70" transform="rotate(-32 120 320)" />
            <ellipse cx="170" cy="280" rx="22" ry="60" transform="rotate(-14 170 280)" />
            <ellipse cx="90" cy="250" rx="20" ry="54" transform="rotate(-48 90 250)" />
            <ellipse cx="200" cy="360" rx="24" ry="64" transform="rotate(-22 200 360)" />
            <ellipse cx="140" cy="400" rx="18" ry="50" transform="rotate(-38 140 400)" />
            <ellipse cx="230" cy="300" rx="16" ry="46" transform="rotate(8 230 300)" />
            <path
              d="M150 220c-20 70 -10 150 20 220"
              stroke="#243528"
              strokeWidth="2.5"
              fill="none"
              opacity="0.4"
            />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* Left vertical rail */}
        <aside className="relative hidden w-14 shrink-0 flex-col items-center justify-between border-r border-white/10 bg-[#5A5F4D] py-6 lg:flex xl:w-16">
          <Logo compact tone="light" />

          <span className="font-display text-[0.58rem] font-medium tracking-[0.45em] uppercase text-warm-white/70 [writing-mode:vertical-rl] rotate-180">
            Aura of Nature
          </span>

          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[0.58rem] tabular-nums leading-tight text-warm-white/85">
              {slideNum}
              <span className="block text-warm-white/40">{totalNum}</span>
            </span>
            <span aria-hidden className="block h-10 w-px bg-white/20">
              <span
                className="block w-px bg-soft-gold transition-[height] duration-500 ease-[var(--ease-out-expo)]"
                style={{ height: `${((active + 1) / total) * 100}%` }}
              />
            </span>
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-warm-white/70"
            >
              <Menu className="h-3 w-3" strokeWidth={1.5} />
            </span>
          </div>
        </aside>

        {/* Main grid */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-center px-[var(--spacing-gutter)]">
          <div className="grid max-h-full items-center gap-4 py-3 max-lg:auto-rows-auto lg:grid-cols-[minmax(200px,0.85fr)_minmax(0,1.25fr)_minmax(180px,0.6fr)] lg:gap-5 lg:py-4 xl:gap-6">
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

            {/* Featured product card — full-bleed lifestyle image + inset feature pill */}
            <div
              ref={imageRef}
              onMouseEnter={() => {
                hoverPausedRef.current = true
              }}
              onMouseLeave={() => {
                hoverPausedRef.current = false
              }}
              className="relative mx-auto flex h-[min(87vh,780px)] w-full max-w-[35rem] items-end justify-center self-center overflow-hidden rounded-[1.25rem] border border-soft-gold bg-[#ecdfd6] shadow-[0_20px_44px_rgba(36,53,40,0.12)] lg:mx-0 lg:max-w-none"
            >
              {slide.cta ? (
                <Link
                  to={slide.cta.to}
                  aria-label={`View ${slideLabel(slide)}`}
                  className="absolute inset-0 z-[1]"
                >
                  <span className="sr-only">{slideLabel(slide)}</span>
                </Link>
              ) : null}
              <img
                data-main-image
                src={slide.image}
                alt={slideLabel(slide)}
                className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
                loading="eager"
                draggable={false}
              />
              {/* Continuity layer — slides in as the next featured frame */}
              <img
                data-main-incoming
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-0 will-change-transform"
                style={{ visibility: 'hidden' }}
                draggable={false}
              />

              {/* Inset floating feature pill */}
              <div
                data-feature-pill
                className="pointer-events-none relative z-10 m-2.5 grid w-[calc(100%-1.25rem)] grid-cols-3 gap-1 rounded-[0.8rem] border border-white/40 bg-warm-white/80 px-2 py-2 backdrop-blur-md sm:m-3 sm:w-[calc(100%-1.5rem)] sm:gap-1.5 sm:px-2.5 sm:py-2.5"
              >
                {features.map((label, i) => {
                  const Icon = i === 0 ? Leaf : i === 1 ? Droplets : Check
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-center gap-1.5 px-1 text-center ${
                        i > 0 ? 'border-l border-forest/12' : ''
                      }`}
                    >
                      <span
                        aria-hidden
                        className="hidden shrink-0 text-soft-gold sm:inline-flex"
                      >
                        <Icon className="h-3 w-3" strokeWidth={1.5} />
                      </span>
                      <p className="text-[0.45rem] font-medium leading-snug tracking-[0.08em] uppercase text-forest/75 sm:text-[0.5rem] sm:tracking-[0.1em]">
                        {label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Up next card — full-bleed cover image + overlay chrome */}
            <div
              ref={previewRef}
              className="relative mx-auto h-[min(79vh,670px)] w-full max-w-[25rem] self-center overflow-hidden rounded-[1.25rem] border border-forest/12 bg-[#e4dccd] shadow-[0_16px_36px_rgba(36,53,40,0.1)] lg:mx-0 lg:max-w-none"
            >
              <div className="absolute inset-0 overflow-hidden">
                {/* Current up-next panel */}
                <div
                  data-preview-panel
                  className="absolute inset-0 will-change-transform"
                >
                  <img
                    data-preview-image
                    src={upcoming.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#eadac3]/95 via-[#eadac3]/55 to-transparent px-4 pb-16 pt-4 sm:px-5 sm:pt-5">
                    <span className="block h-px w-7 bg-soft-gold" />
                    <p className="mt-2 text-[0.48rem] font-semibold tracking-[0.34em] uppercase text-forest/45">
                      Up next
                    </p>
                    <p
                      data-preview-title
                      className="mt-1.5 font-display text-[clamp(0.95rem,1.25vw,1.2rem)] uppercase leading-[1.05] tracking-wide text-forest"
                    >
                      {previewTitle(upcoming)}
                    </p>
                  </div>
                </div>

                {/* Incoming up-next panel — slides in as the continuous next frame */}
                <div
                  data-preview-incoming-panel
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 will-change-transform"
                  style={{ visibility: 'hidden' }}
                >
                  <img
                    data-preview-incoming
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#eadac3]/95 via-[#eadac3]/55 to-transparent px-4 pb-16 pt-4 sm:px-5 sm:pt-5">
                    <span className="block h-px w-7 bg-soft-gold" />
                    <p className="mt-2 text-[0.48rem] font-semibold tracking-[0.34em] uppercase text-forest/45">
                      Up next
                    </p>
                    <p
                      data-preview-incoming-title
                      className="mt-1.5 font-display text-[clamp(0.95rem,1.25vw,1.2rem)] uppercase leading-[1.05] tracking-wide text-forest"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#eadac3]/90 via-[#eadac3]/40 to-transparent px-4 pb-4 pt-10 sm:px-5">
                {upcoming.cta ? (
                  <Link
                    to={upcoming.cta.to}
                    aria-label={`View ${previewTitle(upcoming)}`}
                    className="group inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-forest/25 bg-warm-white/70 px-5 text-[0.52rem] font-semibold tracking-[0.22em] uppercase text-forest backdrop-blur-sm transition-colors duration-400 hover:border-soft-gold hover:bg-soft-gold/12"
                  >
                    View Product
                    <span
                      aria-hidden
                      className="inline-flex text-soft-gold transition-transform duration-400 group-hover:translate-x-0.5"
                    >
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label={`View next: ${previewTitle(upcoming)}`}
                    onClick={goNext}
                    disabled={busy || total < 2}
                    className="group inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-forest/25 bg-warm-white/70 px-5 text-[0.52rem] font-semibold tracking-[0.22em] uppercase text-forest backdrop-blur-sm transition-colors duration-400 hover:border-soft-gold hover:bg-soft-gold/12 disabled:opacity-50"
                  >
                    View Next
                    <span
                      aria-hidden
                      className="inline-flex text-soft-gold transition-transform duration-400 group-hover:translate-x-0.5"
                    >
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand footer bar */}
      <div className="relative z-10 flex min-h-12 shrink-0 items-center justify-between gap-6 bg-forest px-[var(--spacing-gutter)] py-3.5 text-warm-white sm:min-h-14 sm:py-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-soft-gold">
            <Leaf className="h-3.5 w-3.5" strokeWidth={1.5} />
          </span>
          <p className="text-[0.52rem] font-medium tracking-[0.3em] uppercase text-warm-white/85 sm:text-[0.55rem]">
            Nature. Crafted. Perfected.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-[0.5rem] font-medium tracking-[0.28em] uppercase text-warm-white/70 sm:block">
            Scroll to explore
          </p>
          <span
            aria-hidden
            className="hidden h-px w-12 bg-gradient-to-r from-soft-gold/80 to-soft-gold/15 sm:block"
          />
          <span
            aria-hidden
            className="flex h-5 w-5 items-center justify-center rounded-full border border-soft-gold/50 text-[0.5rem] text-soft-gold"
          >
            i
          </span>
        </div>
      </div>
    </section>
  )
}

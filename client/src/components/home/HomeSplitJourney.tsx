import type { CSSProperties } from 'react'
import { Leaf } from 'lucide-react'
import { splitJourney } from '@/data/home'
import { gsap, ScrollTrigger, useGsap } from '@animations/gsap'
import {
  JourneyCopyPanel,
  JourneyMediaPanel,
  JourneyMobileStack,
} from './split-journey/JourneyPanels'

const SWAP_DUR = 0.75
const IMAGE_DUR = 0.7
const HOLD = 0.28

/**
 * Pinned two-column journey: panels physically swap (FLIP-style),
 * then the image stack vertically transitions — scrubbed + snapped.
 */
export function HomeSplitJourney() {
  const { eyebrow, title, titleItalic, subtitle, slides } = splitJourney
  const total = slides.length
  const splitBoxStyle = { ['--journey-gap' as string]: '1rem' } as CSSProperties

  const scope = useGsap(() => {
    const root = scope.current
    if (!root) return

    const pin = root.querySelector<HTMLElement>('[data-journey-pin]')
    const mediaWrap = root.querySelector<HTMLElement>('[data-journey-media-wrap]')
    const copyWrap = root.querySelector<HTMLElement>('[data-journey-copy-wrap]')
    const progressFill = root.querySelector<HTMLElement>('[data-journey-progress-fill]')
    const stepCurrent = root.querySelector<HTMLElement>('[data-journey-step-current]')
    const dots = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-journey-dot]'),
    )
    // Scope to pinned desktop stage only (avoid any stray matches)
    const images = gsap.utils.toArray<HTMLElement>(
      pin?.querySelectorAll('[data-journey-image]') ?? [],
    )
    const copyLayers = gsap.utils.toArray<HTMLElement>(
      pin?.querySelectorAll('[data-journey-copy-layer]') ?? [],
    )
    const headerBits = root.querySelectorAll('[data-journey-header]')

    if (!pin || !mediaWrap || !copyWrap || images.length < 2) return

    // Desktop pin layout is xl+ only — avoid ScrollTrigger on stacked mobile/tablet
    if (window.innerWidth < 1280) return

    const swapDistance = () => copyWrap.offsetLeft - mediaWrap.offsetLeft

    // Preload so panels never flash empty green
    slides.forEach((slide) => {
      const preload = new Image()
      preload.src = slide.image
    })

    gsap.fromTo(
      headerBits,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          once: true,
        },
      },
    )

    gsap.set(mediaWrap, {
      left: '0%',
      width: 'calc(50% - var(--journey-gap)/2)',
      x: 0,
      force3D: true,
    })
    gsap.set(copyWrap, {
      left: 'calc(50% + var(--journey-gap)/2)',
      width: 'calc(50% - var(--journey-gap)/2)',
      x: 0,
      force3D: true,
    })

    images.forEach((img, i) => {
      gsap.set(img, {
        yPercent: i === 0 ? 0 : 100,
        scale: i === 0 ? 1 : 1.05,
        zIndex: images.length - i,
        force3D: true,
      })
    })

    copyLayers.forEach((layer, i) => {
      const words = layer.querySelectorAll('[data-journey-word]')
      const lines = layer.querySelectorAll('[data-journey-line]')
      const meta = layer.querySelectorAll('[data-journey-meta]')

      gsap.set(layer, {
        opacity: i === 0 ? 1 : 0,
        pointerEvents: i === 0 ? 'auto' : 'none',
      })

      if (i === 0) {
        gsap.set(words, { yPercent: 0 })
        gsap.set(lines, { y: 0, opacity: 1 })
        gsap.set(meta, { y: 0, opacity: 1 })
      } else {
        gsap.set(words, { yPercent: 110 })
        gsap.set(lines, { y: 18, opacity: 0 })
        gsap.set(meta, { y: 12, opacity: 0 })
      }
    })

    let activeStep = -1
    const setActiveStep = (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index))
      if (clamped === activeStep) return
      activeStep = clamped
      if (stepCurrent) {
        stepCurrent.textContent = String(clamped + 1).padStart(2, '0')
      }
      dots.forEach((dot, i) => {
        const active = i === clamped
        gsap.to(dot, {
          scaleY: active ? 1.65 : 1,
          backgroundColor: active ? '#b8975c' : 'rgba(36,53,40,0.2)',
          duration: 0.35,
          overwrite: 'auto',
        })
      })
    }

    const tl = gsap.timeline({ defaults: { ease: 'none' } })

    const revealCopy = (layer: HTMLElement, at: string | number = '+=0') => {
      const words = layer.querySelectorAll('[data-journey-word]')
      const lines = layer.querySelectorAll('[data-journey-line]')
      const meta = layer.querySelectorAll('[data-journey-meta]')

      tl.to(layer, { opacity: 1, duration: 0.25, ease: 'power1.out' }, at)
      tl.to(
        meta,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '<',
      )
      tl.to(
        words,
        {
          yPercent: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power3.out',
        },
        '<+=0.06',
      )
      tl.to(
        lines,
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.14,
          ease: 'power2.out',
        },
        '<+=0.18',
      )
    }

    const hideCopy = (layer: HTMLElement, at: string | number = '+=0') => {
      const words = layer.querySelectorAll('[data-journey-word]')
      const lines = layer.querySelectorAll('[data-journey-line]')
      const meta = layer.querySelectorAll('[data-journey-meta]')

      tl.to(
        [meta, lines],
        {
          y: -12,
          opacity: 0,
          duration: 0.28,
          stagger: 0.03,
          ease: 'power1.in',
        },
        at,
      )
      tl.to(
        words,
        {
          yPercent: -110,
          duration: 0.32,
          stagger: 0.03,
          ease: 'power2.in',
        },
        '<',
      )
      tl.to(layer, { opacity: 0, duration: 0.2, ease: 'power1.in' }, '<+=0.08')
    }

    setActiveStep(0)

    tl.addLabel('rest-0')
    tl.to({}, { duration: HOLD })

    for (let i = 0; i < slides.length - 1; i++) {
      const imageToRight = i % 2 === 0

      tl.to(
        mediaWrap,
        {
          x: imageToRight ? swapDistance() : 0,
          duration: SWAP_DUR,
          ease: 'power3.inOut',
        },
        '+=0',
      )
      tl.to(
        copyWrap,
        {
          x: imageToRight ? -swapDistance() : 0,
          duration: SWAP_DUR,
          ease: 'power3.inOut',
        },
        '<',
      )
      tl.addLabel(`swapped-${i}`)

      tl.set(images[i + 1], { zIndex: images.length + i + 1 }, '+=0.05')
      tl.to(
        images[i],
        {
          yPercent: -100,
          scale: 1,
          duration: IMAGE_DUR,
          ease: 'power3.inOut',
        },
        '<',
      )
      tl.to(
        images[i + 1],
        {
          yPercent: 0,
          scale: 1,
          duration: IMAGE_DUR,
          ease: 'power3.inOut',
        },
        '<',
      )

      hideCopy(copyLayers[i], '<+=0.1')
      tl.set(copyLayers[i], { pointerEvents: 'none' })
      tl.set(copyLayers[i + 1], { pointerEvents: 'auto' })
      // Reset incoming text to start state before reveal (scrub-safe)
      tl.set(copyLayers[i + 1].querySelectorAll('[data-journey-word]'), {
        yPercent: 110,
      })
      tl.set(copyLayers[i + 1].querySelectorAll('[data-journey-line]'), {
        y: 18,
        opacity: 0,
      })
      tl.set(copyLayers[i + 1].querySelectorAll('[data-journey-meta]'), {
        y: 12,
        opacity: 0,
      })
      revealCopy(copyLayers[i + 1], '-=0.05')
      tl.call(() => setActiveStep(i + 1))

      tl.addLabel(`rest-${i + 1}`)
      tl.to({}, { duration: HOLD })
    }

    const scrollLen = () =>
      Math.max(window.innerHeight * (slides.length * 0.85), 900)

    // No snap — Lenis + ScrollTrigger snap fight and freeze mid-section
    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${scrollLen()}`,
      pin: true,
      scrub: 0.45,
      anticipatePin: 1,
      pinSpacing: true,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (progressFill) {
          gsap.set(progressFill, { scaleY: self.progress })
        }
        const p = self.progress
        const segment = 1 / Math.max(1, total - 1)
        const approx = Math.round(p / segment)
        if (p < 0.02) setActiveStep(0)
        else if (p > 0.98) setActiveStep(total - 1)
        else setActiveStep(approx)
      },
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [slides.length, total])

  const titleNodes = (() => {
    if (!titleItalic || !title.includes(titleItalic)) return title
    const i = title.indexOf(titleItalic)
    return (
      <>
        {title.slice(0, i)}
        <em className="font-normal italic text-soft-gold">{titleItalic}</em>
        {title.slice(i + titleItalic.length)}
      </>
    )
  })()

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[#e5d9c7]"
      aria-label="The botanical path"
    >
      {/* Leaf vines — same language as Shop by Concern, top → bottom */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-4 top-0 z-0 h-[min(92%,48rem)] w-[min(52vw,28rem)] opacity-[0.16]"
        viewBox="0 0 500 900"
        fill="none"
        preserveAspectRatio="xMidYMin meet"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path
            d="M340 0 C320 80, 280 160, 240 240 C210 300, 180 360, 155 430 C130 500, 115 570, 105 650 C100 710, 98 770, 100 860"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.7"
          />
          <path d="M340 20 C355 35, 360 60, 345 75 C330 60, 325 35, 340 20Z" />
          <path d="M320 70 C300 60, 280 65, 275 85 C290 90, 310 85, 320 70Z" />
          <path d="M300 120 C320 115, 340 125, 340 145 C320 145, 300 135, 300 120Z" />
          <path d="M280 170 C260 155, 240 158, 235 178 C250 185, 270 180, 280 170Z" />
          <path d="M265 220 C285 215, 305 225, 300 245 C280 243, 262 235, 265 220Z" />
          <path d="M245 270 C225 255, 205 260, 200 280 C218 288, 238 282, 245 270Z" />
          <path d="M225 320 C245 318, 260 330, 255 348 C238 345, 222 335, 225 320Z" />
          <path d="M200 370 C180 358, 160 362, 158 382 C175 388, 194 382, 200 370Z" />
          <path d="M180 420 C198 418, 210 430, 205 448 C188 445, 177 432, 180 420Z" />
          <path d="M155 470 C138 458, 120 462, 118 480 C134 486, 150 480, 155 470Z" />
          <path d="M140 530 C158 528, 170 540, 165 556 C148 553, 137 542, 140 530Z" />
          <path d="M125 590 C108 580, 92 584, 90 600 C106 606, 120 600, 125 590Z" />
          <path d="M115 650 C130 648, 142 658, 138 674 C122 670, 112 660, 115 650Z" />
          <path d="M108 720 C95 710, 80 714, 78 730 C92 736, 105 730, 108 720Z" />
          <path d="M105 790 C118 788, 128 798, 124 812 C110 808, 102 798, 105 790Z" />
        </g>
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-6 top-4 z-0 h-[min(88%,44rem)] w-[min(44vw,24rem)] opacity-[0.14]"
        viewBox="0 0 440 860"
        fill="none"
        preserveAspectRatio="xMidYMin meet"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path
            d="M100 0 C130 90, 170 170, 220 250 C250 300, 280 360, 300 430 C315 490, 325 560, 330 640 C333 710, 332 780, 328 850"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            opacity="0.6"
          />
          <path d="M110 30 C90 40, 82 62, 95 78 C112 68, 118 45, 110 30Z" />
          <path d="M135 85 C155 78, 172 88, 170 108 C152 106, 136 98, 135 85Z" />
          <path d="M160 140 C140 132, 125 138, 125 158 C142 162, 158 155, 160 140Z" />
          <path d="M190 195 C210 190, 225 203, 220 220 C203 217, 188 208, 190 195Z" />
          <path d="M215 250 C195 240, 180 245, 180 265 C196 269, 212 262, 215 250Z" />
          <path d="M245 305 C262 300, 278 312, 273 330 C256 326, 243 318, 245 305Z" />
          <path d="M270 365 C252 355, 238 361, 238 379 C254 383, 268 377, 270 365Z" />
          <path d="M295 425 C310 420, 322 432, 318 448 C302 444, 293 436, 295 425Z" />
          <path d="M310 490 C295 482, 282 488, 282 504 C296 508, 308 502, 310 490Z" />
          <path d="M320 555 C333 550, 344 560, 340 574 C326 570, 318 562, 320 555Z" />
          <path d="M325 620 C312 612, 300 618, 300 632 C312 636, 324 630, 325 620Z" />
          <path d="M328 690 C340 686, 350 696, 346 708 C334 704, 326 698, 328 690Z" />
          <path d="M326 760 C314 752, 302 758, 302 770 C314 774, 324 768, 326 760Z" />
        </g>
      </svg>

      <div className="container-aura relative z-10 pt-[clamp(2rem,4vw,3rem)] pb-4 lg:pb-3">
        <header className="mx-auto max-w-2xl text-center">
          <div data-journey-header="" className="flex flex-col items-center gap-3">
            <Leaf className="h-7 w-7 text-soft-gold" strokeWidth={1.2} />
            <p className="text-[0.62rem] font-medium tracking-[0.32em] uppercase text-forest/55">
              {eyebrow}
            </p>
          </div>
          <h2
            data-journey-header=""
            className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.12] tracking-tight text-forest"
          >
            {titleNodes}
          </h2>
          <p
            data-journey-header=""
            className="mx-auto mt-3 max-w-md text-[0.95rem] font-light leading-[1.7] text-forest/60"
          >
            {subtitle}
          </p>
        </header>
      </div>

      {/* Desktop — full-viewport pin; card centered below fixed header so it never clips */}
      <div data-journey-pin className="relative z-10 hidden h-svh xl:block">
        <div className="flex h-full w-full items-center px-[clamp(0.5rem,1.5vw,1rem)] pt-[2rem] pb-5">
          <div
            className="relative mx-auto h-[min(72svh,42rem)] w-full max-w-[100rem]"
            style={splitBoxStyle}
          >
            <div
              data-journey-media-wrap
              className="absolute top-0 left-0 z-10 h-full overflow-hidden rounded-[1.35rem] ring-1 ring-forest/10 shadow-[0_20px_42px_rgba(36,53,40,0.16)] will-change-[left]"
            >
              <JourneyMediaPanel slides={slides} />
            </div>
            <div
              data-journey-copy-wrap
              className="absolute top-0 left-1/2 z-10 h-full overflow-hidden rounded-[1.35rem] bg-[#3e4736] ring-1 ring-forest/20 shadow-[0_20px_42px_rgba(36,53,40,0.22)] will-change-[left]"
            >
              <JourneyCopyPanel slides={slides} total={total} />
            </div>

            <div className="pointer-events-none absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
              <span
                data-journey-step-current=""
                className="font-display text-[0.8rem] tabular-nums tracking-wide text-forest/65"
              >
                01
              </span>
              <div className="relative h-28 w-px overflow-hidden bg-forest/15">
                <div
                  data-journey-progress-fill=""
                  className="absolute inset-x-0 top-0 h-full origin-top bg-soft-gold"
                  style={{ transform: 'scaleY(0)' }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                {slides.map((slide, i) => (
                  <span
                    key={slide.id}
                    data-journey-dot=""
                    data-index={i}
                    className="h-2 w-px rounded-full bg-forest/20"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="container-aura relative z-10 pb-[clamp(4rem,9vw,6.5rem)] pt-2 xl:hidden">
        <JourneyMobileStack slides={slides} />
      </div>
    </section>
  )
}

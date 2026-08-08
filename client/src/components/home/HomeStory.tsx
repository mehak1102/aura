import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Leaf, Rabbit, Sprout, Flower2 } from 'lucide-react'
import { storyContent } from '@/data/home'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { cn } from '@utils/index'

const storyTrust = [
  { title: '100% Herbal', subtitle: 'Pure & Natural', icon: Leaf },
  { title: 'Cruelty Free', subtitle: 'Be Kind Always', icon: Rabbit },
  { title: 'Sulfate Free', subtitle: 'Gentle on Skin', icon: Sprout },
  { title: 'Made in India', subtitle: 'With Love', icon: Flower2 },
] as const

const TITLE = storyContent.title
const BODY = storyContent.body
const RITUAL_START = TITLE.toLowerCase().indexOf('ritual')
const RITUAL_END = RITUAL_START === -1 ? -1 : RITUAL_START + 'ritual'.length
const TITLE_MS = 38
const BODY_MS = 16
const TITLE_PAUSE = 350

function TitleMarkup({ visible }: { visible: string }) {
  if (RITUAL_START === -1 || visible.length <= RITUAL_START) {
    return <>{visible}</>
  }

  const before = visible.slice(0, RITUAL_START)
  const ritual = visible.slice(RITUAL_START, Math.min(visible.length, RITUAL_END))
  const after = visible.length > RITUAL_END ? visible.slice(RITUAL_END) : ''

  return (
    <>
      {before}
      <em className="font-medium text-[#b8975c]">{ritual}</em>
      {after}
    </>
  )
}

/** Once started, always finishes — pausing on IO flicker left copy stuck mid-sentence. */
function StoryTypewriter({ playKey }: { playKey: number }) {
  const [titleChars, setTitleChars] = useState(0)
  const [bodyChars, setBodyChars] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'title' | 'body' | 'done'>('idle')

  useEffect(() => {
    if (playKey < 1) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTitleChars(TITLE.length)
      setBodyChars(BODY.length)
      setPhase('done')
      return
    }

    setTitleChars(0)
    setBodyChars(0)
    setPhase('title')
  }, [playKey])

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return

    let timer: number

    if (phase === 'title') {
      if (titleChars >= TITLE.length) {
        timer = window.setTimeout(() => setPhase('body'), TITLE_PAUSE)
      } else {
        timer = window.setTimeout(() => setTitleChars((c) => c + 1), TITLE_MS)
      }
    } else if (phase === 'body') {
      if (bodyChars >= BODY.length) {
        timer = window.setTimeout(() => setPhase('done'), 0)
      } else {
        timer = window.setTimeout(() => setBodyChars((c) => c + 1), BODY_MS)
      }
    }

    return () => window.clearTimeout(timer)
  }, [phase, titleChars, bodyChars])

  const titleVisible = TITLE.slice(0, titleChars)
  const showTitleCaret = phase === 'title'
  const showBodyCaret = phase === 'body'

  return (
    <>
      <h2
        className="mt-6 max-w-[26rem] text-[clamp(1.85rem,2.8vw,2.75rem)] font-medium leading-[1.22] tracking-[-0.015em] text-[#1a1a18] text-pretty"
        style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif" }}
        aria-label={TITLE}
      >
        <TitleMarkup visible={titleVisible} />
        {showTitleCaret && (
          <span
            aria-hidden
            className="hero-caret ml-0.5 inline-block w-[0.08em] translate-y-[0.05em] bg-[#b8975c] align-baseline"
            style={{ height: '0.85em' }}
          />
        )}
      </h2>

      <p
        className="mt-5 max-w-[24rem] min-h-[5.5rem] text-[0.92rem] font-normal leading-[1.75] text-[#5a5752] text-pretty"
        aria-label={BODY}
      >
        {BODY.slice(0, bodyChars)}
        {showBodyCaret && (
          <span
            aria-hidden
            className="hero-caret ml-0.5 inline-block w-[0.06em] translate-y-[0.04em] bg-[#b8975c]/80 align-baseline"
            style={{ height: '0.9em' }}
          />
        )}
      </p>
    </>
  )
}

export function HomeStory() {
  const navigate = useNavigate()
  const [playKey, setPlayKey] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)
  const wasInView = useRef(false)
  // Generous margin so Lenis + layout shifts don't flicker the trigger
  const inView = useInView(textRef, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
  }, [])

  useEffect(() => {
    if (inView && !wasInView.current) {
      setPlayKey((k) => k + 1)
    }
    wasInView.current = inView
  }, [inView])

  return (
    <section
      ref={scope}
      id="our-story"
      className="relative overflow-hidden bg-[#f4efe6]"
    >
      {/* Soft leaf shadows — same style as Shop by Concern */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-6 w-[min(52vw,28rem)] opacity-[0.14]"
        viewBox="0 0 500 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path d="M340 0 C320 60, 280 120, 240 180 C220 210, 190 240, 160 280 C140 310, 120 340, 110 380" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
          <path d="M340 20 C355 35, 360 60, 345 75 C330 60, 325 35, 340 20Z" />
          <path d="M320 60 C300 50, 280 55, 275 75 C290 80, 310 75, 320 60Z" />
          <path d="M300 100 C320 95, 340 105, 340 125 C320 125, 300 115, 300 100Z" />
          <path d="M280 130 C260 115, 240 118, 235 138 C250 145, 270 140, 280 130Z" />
          <path d="M265 165 C285 160, 305 170, 300 190 C280 188, 262 180, 265 165Z" />
          <path d="M245 200 C225 185, 205 190, 200 210 C218 218, 238 212, 245 200Z" />
          <path d="M225 240 C245 238, 260 250, 255 268 C238 265, 222 255, 225 240Z" />
          <path d="M200 270 C180 258, 160 262, 158 282 C175 288, 194 282, 200 270Z" />
          <path d="M180 310 C198 308, 210 320, 205 338 C188 335, 177 322, 180 310Z" />
          <path d="M155 340 C138 328, 120 332, 118 350 C134 356, 150 350, 155 340Z" />
        </g>
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-6 top-8 w-[min(44vw,24rem)] opacity-[0.12]"
        viewBox="0 0 440 520"
        fill="none"
      >
        <g className="text-[#2d4a32]" fill="currentColor" stroke="none">
          <path d="M100 0 C130 70, 170 130, 220 190 C250 220, 280 260, 300 310 C310 340, 320 370, 320 410" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.6" />
          <path d="M110 30 C90 40, 82 62, 95 78 C112 68, 118 45, 110 30Z" />
          <path d="M135 75 C155 68, 172 78, 170 98 C152 96, 136 88, 135 75Z" />
          <path d="M160 120 C140 112, 125 118, 125 138 C142 142, 158 135, 160 120Z" />
          <path d="M190 160 C210 155, 225 168, 220 185 C203 182, 188 173, 190 160Z" />
          <path d="M215 205 C195 195, 180 200, 180 220 C196 224, 212 217, 215 205Z" />
          <path d="M245 245 C262 240, 278 252, 273 270 C256 266, 243 258, 245 245Z" />
          <path d="M270 290 C252 280, 238 286, 238 304 C254 308, 268 302, 270 290Z" />
          <path d="M295 335 C310 330, 322 342, 318 358 C302 354, 293 346, 295 335Z" />
        </g>
      </svg>

      <div className="relative mx-auto w-full max-w-[86rem] px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:gap-12 xl:gap-16">
          {/* Text — left */}
          <div ref={textRef} className="min-w-0 max-w-[28rem] lg:max-w-none lg:pr-6">
            <p
              data-reveal=""
              className="text-[0.65rem] font-medium tracking-[0.32em] uppercase text-[#6b6560]"
            >
              {storyContent.eyebrow}
            </p>

            <div data-reveal="" className="mt-4 flex items-center gap-3" aria-hidden>
              <span className="h-px w-12 bg-[#1b261e]/25" />
              <Leaf className="h-4 w-4 text-[#b8975c]" strokeWidth={1.4} />
              <span className="h-px w-12 bg-[#1b261e]/25" />
            </div>

            <StoryTypewriter playKey={playKey} />

            <div data-reveal="" className="mt-8">
              <button
                type="button"
                onClick={() => navigate(storyContent.cta.to)}
                className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-[#1b261e]/30 bg-transparent px-7 text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-[#1b261e] transition-colors duration-300 hover:border-[#1b261e] hover:bg-[#1b261e]/5"
              >
                {storyContent.cta.label}
                <ArrowRight
                  className="h-3.5 w-3.5 text-[#b8975c] transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>
            </div>
          </div>

          {/* Image — right, larger */}
          <div data-reveal-image className="relative min-w-0">
            <Link
              to={`/product/${storyContent.productSlug}`}
              aria-label="View Jojoba Cold Pressed Oil"
              className="group block overflow-hidden rounded-[2rem] bg-[#ebe4d8] shadow-[0_24px_60px_rgba(26,26,24,0.08)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] md:rounded-[2.75rem]"
            >
              <img
                src={storyContent.image}
                alt={storyContent.imageAlt}
                className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] lg:aspect-[16/11] xl:min-h-[30rem]"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="relative z-10 border-t border-[#1b261e]/10">
        <div className="mx-auto w-full max-w-[86rem] px-[var(--spacing-gutter)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {storyTrust.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  data-reveal=""
                  className={cn(
                    'relative flex items-center gap-3.5 px-2 py-8 sm:gap-4 sm:px-5 sm:py-9',
                    i < storyTrust.length - 1 &&
                      'lg:after:absolute lg:after:right-0 lg:after:top-1/4 lg:after:h-1/2 lg:after:w-px lg:after:bg-[#1b261e]/12',
                  )}
                >
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1b261e]/20 sm:h-12 sm:w-12"
                    aria-hidden
                  >
                    <Icon className="h-[1.1rem] w-[1.1rem] text-[#1b261e]/70" strokeWidth={1.35} />
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#1a1a18]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[0.8rem] font-normal text-[#6b6560]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Leaf, Rabbit, Sprout, Flower2 } from 'lucide-react'
import { storyContent } from '@/data/home'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'
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

function StoryTypewriter({ active }: { active: boolean }) {
  const [titleChars, setTitleChars] = useState(0)
  const [bodyChars, setBodyChars] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'title' | 'body' | 'done'>('idle')

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTitleChars(TITLE.length)
      setBodyChars(BODY.length)
      setPhase('done')
      return
    }
    setPhase('title')
  }, [active])

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
        {titleVisible.split('').map((ch, i) => {
          const isRitual = RITUAL_START !== -1 && i >= RITUAL_START && i < RITUAL_END
          return isRitual ? (
            <em key={i} className="font-medium text-[#b8975c]">
              {ch}
            </em>
          ) : (
            <span key={i}>{ch}</span>
          )
        })}
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
  const [inView, setInView] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
  }, [])

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={scope}
      id="our-story"
      className="overflow-hidden bg-[#f4efe6]"
    >
      <div className="mx-auto w-full max-w-[86rem] px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
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
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b8975c]/80 bg-transparent" />
              <span className="h-px w-12 bg-[#1b261e]/25" />
            </div>

            <StoryTypewriter active={inView} />

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
      <div className="border-t border-[#1b261e]/10">
        <div className="mx-auto w-full max-w-[86rem] px-[var(--spacing-gutter)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
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
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#1b261e]/20"
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

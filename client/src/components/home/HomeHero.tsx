import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  Beaker,
  Leaf,
  Rabbit,
  Sprout,
  Star,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { useGsap, animateHero } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { scrollToSection } from '@/lib/lenisControl'
import { cn } from '@utils/index'

type TrustItem = {
  title: string
  subtitle: string
  icon?: typeof Leaf
  featured?: boolean
}

const trustItems: TrustItem[] = [
  { title: '100% Herbal', subtitle: 'Pure & Natural', icon: Leaf },
  { title: 'Cruelty Free', subtitle: 'Be Kind Always', icon: Rabbit },
  { title: 'Sulfate Free', subtitle: 'Gentle on Skin', icon: Sprout },
  { title: 'Happy Customers', subtitle: 'Trusted by Thousands', featured: true },
  { title: 'Made in India', subtitle: 'With Love', icon: Leaf },
  { title: 'Dermatologically Tested', subtitle: 'Safe & Effective', icon: Beaker },
]

const HERO_LINES = ['Nature', 'Crafted.', 'Science', 'Perfected.'] as const
const HERO_FULL = HERO_LINES.join('\n')
const TYPE_MS = 70
const HOLD_MS = 2200
const CLEAR_MS = 28

function TrustIcon({ icon: Icon }: { icon: typeof Leaf }) {
  return (
    <span
      className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#b8975c]/75"
      aria-hidden
    >
      <Icon className="h-3.5 w-3.5 text-[#b8975c]" strokeWidth={1.25} />
    </span>
  )
}

function HeroTypewriter({ active }: { active: boolean }) {
  const [chars, setChars] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'hold' | 'clearing'>('typing')

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(HERO_FULL.length)
      setPhase('hold')
      return
    }

    let timer: number

    if (phase === 'typing') {
      if (chars >= HERO_FULL.length) {
        timer = window.setTimeout(() => setPhase('hold'), 0)
      } else {
        timer = window.setTimeout(() => setChars((c) => c + 1), TYPE_MS)
      }
    } else if (phase === 'hold') {
      timer = window.setTimeout(() => setPhase('clearing'), HOLD_MS)
    } else if (chars <= 0) {
      timer = window.setTimeout(() => setPhase('typing'), 400)
    } else {
      timer = window.setTimeout(() => setChars((c) => c - 1), CLEAR_MS)
    }

    return () => window.clearTimeout(timer)
  }, [chars, phase, active])

  const visible = HERO_FULL.slice(0, chars)
  const filled = visible.split('\n')
  const activeLine = Math.max(0, filled.length - 1)
  const lines = [...filled]
  while (lines.length < HERO_LINES.length) lines.push('')

  return (
    <h1
      data-hero-title
      className="mt-5 min-h-[calc(4*0.98em)] text-[clamp(2.9rem,6.2vw,5.35rem)] font-medium leading-[0.98] tracking-[-0.03em] text-[#1b261e]"
      style={{
        fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
        fontOpticalSizing: 'auto',
      }}
      aria-label="Nature Crafted. Science Perfected."
    >
      {lines.map((line, i) => (
        <span key={i} className="block min-h-[0.98em]">
          {line.split('').map((ch, j) =>
            ch === '.' ? (
              <span key={j} className="text-[#b8975c]">
                .
              </span>
            ) : (
              <span key={j}>{ch}</span>
            ),
          )}
          {active && phase !== 'hold' && i === activeLine && (
            <span
              aria-hidden
              className="hero-caret ml-0.5 inline-block w-[0.08em] translate-y-[0.06em] bg-[#b8975c] align-baseline"
              style={{ height: '0.85em' }}
            />
          )}
        </span>
      ))}
    </h1>
  )
}

/**
 * Exact portal hero — cream wall + forest arch product stage with UI overlay.
 */
export function HomeHero() {
  const navigate = useNavigate()
  const scope = useGsap(() => {
    if (scope.current) return animateHero(scope.current)
  }, [])
  const inView = useInView(scope, { threshold: 0.2, initial: true })

  return (
    <section
      ref={scope}
      className="relative flex h-[100svh] min-h-[680px] flex-col overflow-hidden bg-[#e8e2d6]"
    >
      {/* Full-bleed product environment */}
      <div className="absolute inset-0">
        <img
          data-hero-media
          // src="/hero/hero-fullscreen.png"
          src="/hero/image.png"
          alt=""
          className="h-full w-full object-cover object-[72%_center] max-[480px]:object-[78%_center] xl:object-[68%_center]"
          fetchPriority="high"
          draggable={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-36 bg-gradient-to-b from-black/60 via-black/28 to-transparent md:h-44"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-[#e8e2d6]/50 via-[#e8e2d6]/15 to-transparent max-lg:w-[70%]"
        />
        <div
          data-hero-fore
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              'radial-gradient(ellipse 18% 22% at 78% 42%, rgba(90,107,72,0.18), transparent 70%), radial-gradient(ellipse 12% 16% at 62% 58%, rgba(184,151,92,0.1), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col pt-[4.25rem] md:pt-[4.75rem]">
        <div className="mx-auto flex w-full max-w-[86rem] flex-1 items-center px-[var(--spacing-gutter)] pb-5 lg:pb-7">
          <div
            data-hero-mid
            className="w-full max-w-[32rem] lg:max-w-[38rem]"
            style={{ perspective: '500px' }}
          >
            <p
              data-hero-fade
              className="relative inline-block text-[0.7rem] font-medium tracking-[0.42em] uppercase text-[#3d4a38]"
            >
              Nature. Purity. You.
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-[68%] bg-[#3d4a38]/40"
              />
            </p>

            <HeroTypewriter active={inView} />

            <p
              data-hero-fade
              className="mt-5 max-w-[26rem] text-[1rem] font-normal leading-[1.7] text-[#2a3228]/90"
            >
              Herbal skincare inspired by ancient wisdom and perfected through modern science.
            </p>

            <div data-hero-fade className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <button
                type="button"
                onClick={() => navigate(ROUTES.shop)}
                className="group inline-flex h-[3.05rem] items-center justify-center gap-2.5 bg-forest px-6 text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-warm-white transition-colors duration-300 hover:bg-forest-deep"
              >
                Shop Collection
                <ArrowRight
                  className="h-3.5 w-3.5 text-soft-gold transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ourStory)}
                className="group inline-flex h-[3.05rem] items-center justify-center gap-2.5 border border-soft-gold/90 bg-beige/40 px-6 text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-forest transition-colors duration-300 hover:bg-beige/70"
              >
                Discover Our Story
                <ArrowRight
                  className="h-3.5 w-3.5 text-soft-gold transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>
            </div>

            <div
              data-hero-fade
              className="mt-10 flex items-center gap-3 font-display text-[0.78rem] tracking-[0.14em] text-[#b8975c]/85"
              aria-hidden
            >
              <span>01</span>
              <span className="h-px w-16 bg-[#b8975c]/45 sm:w-[4.5rem]" />
              <span>05</span>
            </div>
          </div>
        </div>


        {/* Gold wisdom seal */}
        <div
          data-hero-fade
          className="pointer-events-none absolute right-[clamp(3.5rem,11vw,8.5rem)] top-[36%] z-20 hidden h-[7rem] w-[7rem] -translate-y-1/2 items-center justify-center lg:flex xl:right-[clamp(4rem,12vw,9.5rem)]"
          aria-hidden
        >
          <svg viewBox="0 0 140 140" className="h-full w-full">
            <defs>
              <path id="hero-seal-top" d="M 70,70 m -46,0 a 46,46 0 1,1 92,0" />
              <path id="hero-seal-bottom" d="M 70,70 m 46,0 a 46,46 0 1,1 -92,0" />
            </defs>
            <circle cx="70" cy="70" r="54" fill="none" stroke="#b8975c" strokeWidth="0.85" />
            <circle cx="70" cy="70" r="48" fill="none" stroke="#b8975c" strokeWidth="0.4" opacity="0.65" />
            <text
              fill="#b8975c"
              fontSize="7.2"
              letterSpacing="2.4"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              <textPath href="#hero-seal-top" startOffset="8%">
                POWERED BY ANCIENT WISDOM
              </textPath>
            </text>
            <text
              fill="#b8975c"
              fontSize="7.2"
              letterSpacing="2.4"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              <textPath href="#hero-seal-bottom" startOffset="6%">
                BACKED BY MODERN SCIENCE
              </textPath>
            </text>
          </svg>
          <span className="absolute h-px w-7 bg-[#b8975c]/70" />
          <Leaf className="absolute h-3.5 w-3.5 text-[#b8975c]" strokeWidth={1.4} />
        </div>

        {/* Scroll cue → Our Story */}
        <button
          type="button"
          data-hero-fade
          onClick={() => scrollToSection('#our-story')}
          className="absolute right-5 top-[44%] z-20 hidden -translate-y-1/2 cursor-pointer flex-col items-center gap-3.5 transition-opacity hover:opacity-80 lg:flex xl:right-8"
          aria-label="Scroll to explore"
        >
          <p
            className="text-[0.5rem] font-medium tracking-[0.32em] uppercase text-[#f5f2ed]/70"
            style={{ writingMode: 'vertical-rl' }}
          >
            Scroll to explore
          </p>
          <span className="h-11 w-px bg-[#f5f2ed]/35" aria-hidden />
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#f5f2ed]/40">
            <ArrowDown className="h-3 w-3 text-[#f5f2ed]/75" strokeWidth={1.5} aria-hidden />
          </span>
        </button>

        {/* Trust bar */}
        <div className="relative z-30 bg-[#1b261e] text-[#b8975c]">
          <div className="mx-auto grid max-w-[86rem] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {trustItems.map((item, i) => (
              <div
                key={item.title}
                data-hero-fade
                className={cn(
                  'relative flex flex-col items-center gap-1 px-2.5 py-5 text-center sm:py-[1.25rem]',
                  i < trustItems.length - 1 &&
                    'lg:after:absolute lg:after:right-0 lg:after:top-[22%] lg:after:h-[56%] lg:after:w-px lg:after:bg-[#b8975c]/25',
                )}
              >
                {item.featured ? (
                  <>
                    <div className="mb-0.5 flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star key={s} className="h-2.5 w-2.5 fill-[#b8975c] text-[#b8975c]" />
                      ))}
                    </div>
                    <p
                      className="text-[1.15rem] font-medium leading-none tracking-[-0.02em] text-[#b8975c]"
                      style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif" }}
                    >
                      10,000+
                    </p>
                    <p className="text-[0.52rem] font-semibold tracking-[0.16em] uppercase leading-snug">
                      {item.title}
                    </p>
                  </>
                ) : (
                  <>
                    {item.icon && <TrustIcon icon={item.icon} />}
                    <p className="text-[0.52rem] font-semibold tracking-[0.16em] uppercase leading-snug">
                      {item.title}
                    </p>
                  </>
                )}
                <p className="text-[0.5rem] font-light tracking-[0.04em] text-[#f5f2ed]/55">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

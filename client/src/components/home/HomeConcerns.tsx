import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Droplet,
  Leaf,
  ScanFace,
  Sparkles,
  Sun,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { concerns } from '@/data/home'
import { gsap, ScrollTrigger, splitText, useGsap } from '@animations/gsap'

const concernIcons: Record<(typeof concerns)[number]['icon'], LucideIcon> = {
  scan: ScanFace,
  droplet: Droplet,
  sparkles: Sparkles,
  wind: Wind,
  sun: Sun,
  leaf: Leaf,
}

const titleWords: { text: string; italic?: boolean }[] = [
  { text: 'What' },
  { text: 'is' },
  { text: 'your' },
  { text: 'skin', italic: true },
  { text: 'asking' },
  { text: 'for?' },
]

export function HomeConcerns() {
  const scope = useGsap(() => {
    if (!scope.current) return

    const eyebrow = scope.current.querySelector('[data-reveal-eyebrow]')
    const titleWordsEls = scope.current.querySelectorAll('[data-title-word]')
    const subtitleEl = scope.current.querySelector<HTMLElement>('[data-word-split="subtitle"]')
    const cards = scope.current.querySelectorAll('[data-reveal-card]')

    const subtitleWords = subtitleEl ? splitText(subtitleEl, 'words') : []

    gsap.set(
      [eyebrow, ...Array.from(titleWordsEls), ...subtitleWords, ...Array.from(cards)].filter(
        Boolean,
      ),
      { y: 28, opacity: 0 },
    )

    const tl = gsap.timeline({ paused: true })

    if (eyebrow) {
      tl.fromTo(
        eyebrow,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
      )
    }

    if (titleWordsEls.length) {
      tl.fromTo(
        titleWordsEls,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
        '-=0.15',
      )
    }

    if (subtitleWords.length) {
      tl.fromTo(
        subtitleWords,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, stagger: 0.018, ease: 'power2.out' },
        '-=0.25',
      )
    }

    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.14, ease: 'power3.out' },
        '-=0.05',
      )
    }

    const trigger = ScrollTrigger.create({
      trigger: scope.current,
      start: 'top 78%',
      once: true,
      onEnter: () => tl.play(0),
    })

    return () => {
      tl.kill()
      trigger.kill()
    }
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[#f6f1e8] pt-[clamp(2.75rem,6vw,4.5rem)] pb-[clamp(2.75rem,5vw,4.25rem)]"
    >
      {/* Soft leaf shadows — realistic SVG leaves */}
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
          {/* Branch */}
          <path d="M340 0 C320 60, 280 120, 240 180 C220 210, 190 240, 160 280 C140 310, 120 340, 110 380" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
          {/* Leaves along branch */}
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
          {/* Branch */}
          <path d="M100 0 C130 70, 170 130, 220 190 C250 220, 280 260, 300 310 C310 340, 320 370, 320 410" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.6" />
          {/* Leaves */}
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

      <div className="container-aura relative">
        <header className="mx-auto max-w-2xl text-center">
          <div data-reveal-eyebrow="" className="flex flex-col items-center gap-3">
            <Leaf className="h-7 w-7 text-[#b8975c]" strokeWidth={1.2} />
            <p className="text-[0.62rem] font-medium tracking-[0.32em] uppercase text-[#8a8478]">
              Shop by concern
            </p>
          </div>
          <h2
            className="mt-4 font-display text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.12] tracking-tight text-forest"
            aria-label="What is your skin asking for?"
          >
            {titleWords.map((word, i) => (
              <span key={`${word.text}-${i}`}>
                {i > 0 ? ' ' : null}
                <span
                  data-title-word=""
                  className={`inline-block ${word.italic ? 'italic font-normal' : ''}`}
                >
                  {word.text}
                </span>
              </span>
            ))}
          </h2>
          <p
            data-word-split="subtitle"
            className="mx-auto mt-4 max-w-md text-[0.95rem] font-light leading-[1.7] text-[#6a645c]"
          >
            Begin with the concern — we will meet you with botanicals that listen.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-16 lg:gap-6">
          {concerns.map((item) => {
            const Icon = concernIcons[item.icon]
            return (
              <Link
                key={item.id}
                data-reveal-card=""
                to={item.to}
                className="group relative flex min-h-[11rem] overflow-hidden rounded-[1.25rem] bg-[#faf7f1] px-3.5 py-4 shadow-[0_1px_0_rgba(36,53,40,0.04)] ring-1 ring-[#243528]/10 transition-[box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(36,53,40,0.1)] sm:min-h-[14rem] sm:px-7 sm:py-7"
              >
                {/* Image — same default crop; expands full-cover only on hover */}
                <div className="absolute top-1.5 right-2 bottom-1.5 left-[42%] z-0 overflow-hidden rounded-[0.95rem] transition-[top,right,bottom,left,border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:inset-0 group-hover:rounded-[1.25rem] sm:top-2 sm:right-3 sm:bottom-2 sm:left-[46%] sm:group-hover:inset-0">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover object-[55%_center] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#faf7f1] to-transparent transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1a18]/72 via-[#1a1a18]/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>

                {/* Active corner tag */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-px -top-px z-20 h-0 w-0 border-l-[2.4rem] border-t-[2.4rem] border-l-transparent border-t-forest opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                />
                <ArrowUpRight
                  aria-hidden
                  className="pointer-events-none absolute right-1.5 top-1.5 z-20 h-3 w-3 text-warm-white opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  strokeWidth={2}
                />

                <div className="relative z-10 flex w-[48%] flex-col justify-between py-0.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#b8975c]/12 text-[#b8975c] transition-colors duration-500 group-hover:bg-white/20 group-hover:text-warm-white sm:h-12 sm:w-12">
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.05rem] leading-tight tracking-tight text-[#243528] transition-colors duration-500 group-hover:text-warm-white sm:text-[1.45rem]">
                      {item.label}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[0.52rem] font-medium tracking-[0.18em] uppercase text-[#8a8478] transition-colors duration-500 group-hover:text-warm-white/85 sm:mt-2.5 sm:text-[0.58rem] sm:tracking-[0.22em]">
                      Shop
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

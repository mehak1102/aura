import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Leaf } from 'lucide-react'
import { editorialScroll, featuredSplit } from '@/data/home'
import {
  gsap,
  useGsap,
  prefersReducedMotion,
  ScrollTrigger,
  splitText,
} from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { scrollToY } from '@/lib/lenisControl'

function GhostPill({
  to,
  children,
}: {
  to: string
  children: string
}) {
  return (
    <Link
      to={to}
      className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-warm-white/80 px-6 text-[0.65rem] tracking-[0.22em] uppercase text-warm-white transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(250,248,244,0.35)] sm:h-12 sm:px-9 sm:text-micro sm:tracking-[0.26em]"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-warm-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-[#5c2f38]">
        {children}
      </span>
      <span
        aria-hidden
        className="relative z-10 ml-2.5 inline-block text-[0.85em] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#5c2f38]"
      >
        →
      </span>
    </Link>
  )
}

function RitualsCta({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-warm-white/80 px-6 text-[0.65rem] tracking-[0.22em] uppercase text-warm-white sm:h-12 sm:px-9 sm:text-micro sm:tracking-[0.26em]"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-warm-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-[#5c2f38]">
        {children}
      </span>
      <span
        aria-hidden
        className="relative z-10 ml-2.5 inline-block text-[0.85em] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#5c2f38]"
      >
        →
      </span>
    </Link>
  )
}

function RitualTitle({
  lines,
  className = 'absolute left-[3.5%] top-[5.5%] z-20 max-w-[8.6ch] font-display text-[clamp(3.75rem,7.2vw,6.75rem)] leading-[0.88] tracking-tight uppercase',
}: {
  lines: readonly string[]
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { threshold: 0.2, rootMargin: '10% 20%', initial: false })
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Build once — do not kill/rebuild on IO flicker (that froze the editorial scroll)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const words = el.querySelectorAll<HTMLElement>('[data-ritual-word]')
    if (!words.length) return

    gsap.set(words, { y: '110%', opacity: 0 })

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.55,
      paused: true,
    })

    words.forEach((word, i) => {
      tl.to(
        word,
        {
          y: '0%',
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        i === 0 ? undefined : '-=0.28',
      )
    })

    tl.to({}, { duration: 1.8 })

    words.forEach((word, i) => {
      tl.to(
        word,
        {
          y: '-110%',
          opacity: 0,
          duration: 0.55,
          ease: 'power2.in',
        },
        i === 0 ? undefined : '-=0.32',
      )
    })

    tl.set(words, { y: '110%', opacity: 0 })
    timelineRef.current = tl

    return () => {
      tl.kill()
      timelineRef.current = null
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll<HTMLElement>('[data-ritual-word]')
    const tl = timelineRef.current

    if (!inView || prefersReducedMotion() || !tl) {
      tl?.pause()
      if (words.length) gsap.set(words, { y: 0, opacity: 1 })
      return
    }

    tl.play()
  }, [inView])

  return (
    <h2
      ref={ref}
      className={className}
      aria-label={lines.join(' ')}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <span data-ritual-word className="inline-block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </h2>
  )
}


function ScrollDiscover({
  label,
  onDiscover,
}: {
  label: string
  onDiscover: () => void
}) {
  return (
    <button
      type="button"
      onClick={onDiscover}
      className="group mt-5 flex max-w-[11rem] items-center gap-3 text-left transition-colors"
      aria-label={label}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warm-white/45 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-warm-white group-hover:bg-warm-white/12 group-hover:shadow-[0_0_0_6px_rgba(250,248,244,0.06)]">
        <ArrowDownLeft
          className="h-3.5 w-3.5 text-warm-white/80 transition-transform duration-500 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:text-warm-white"
          strokeWidth={1.35}
          aria-hidden
        />
      </span>
      <span className="text-[0.62rem] font-medium tracking-[0.24em] uppercase leading-snug text-warm-white/65 transition-colors duration-500 group-hover:text-warm-white">
        <span className="border-b border-warm-white/25 pb-0.5 transition-[border-color] duration-500 group-hover:border-warm-white/70">
          {label}
        </span>
      </span>
    </button>
  )
}

function FlowBody({
  paragraphs,
  className,
  paragraphClassName = 'mb-5 text-[0.8rem] font-light leading-[1.85] text-warm-white/88',
}: {
  paragraphs: readonly string[]
  className?: string
  paragraphClassName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.15, rootMargin: '10% 25%' })
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll<HTMLElement>('[data-flow-word]')
    if (!words.length) return

    tweenRef.current?.kill()
    tweenRef.current = null

    if (!inView) {
      gsap.set(words, { opacity: 1, y: 0 })
      return
    }

    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 })
      return
    }

    gsap.set(words, { opacity: 0, y: 10 })
    const tween = gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.026,
      ease: 'power2.out',
    })
    tweenRef.current = tween

    return () => {
      tween.kill()
      tweenRef.current = null
    }
  }, [inView])

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className={paragraphClassName}>
          {paragraph.split(' ').map((word, i, arr) => (
            <span key={`${word}-${i}`} className="inline-block">
              <span data-flow-word className="inline-block">
                {word}
              </span>
              {i < arr.length - 1 ? '\u00A0' : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}

function Frame({
  src,
  alt,
  className,
  float,
  to,
}: {
  src: string
  alt: string
  className?: string
  /** Parallax intensity while the section scrolls */
  float?: number
  /** Product detail path — makes the frame clickable */
  to?: string
}) {
  const inner = (
    <>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-110"
        loading="lazy"
        draggable={false}
      />
    </>
  )

  const frameClass = `group/frame block overflow-hidden border border-warm-white/90 bg-[#f3ebe3]/20 shadow-[0_28px_60px_rgba(0,0,0,0.28)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-30 hover:scale-[1.04] ${className ?? ''}`

  if (to) {
    return (
      <Link
        to={to}
        data-float={float ?? undefined}
        aria-label={alt}
        className={`${frameClass} cursor-pointer`}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div data-float={float ?? undefined} className={frameClass}>
      {inner}
    </div>
  )
}

function advancePinnedScroll(section: HTMLElement) {
  const pin = ScrollTrigger.getAll().find(
    (t) => t.trigger === section && Boolean(t.vars.pin),
  )

  if (!pin) {
    scrollToY(window.scrollY + window.innerHeight * 0.7)
    return
  }

  const range = pin.end - pin.start
  const step = range / 2.4
  const next = Math.min(pin.end, pin.scroll() + step)
  scrollToY(next)
}

function editorialMotion(section: HTMLElement, track: HTMLElement) {
  if (prefersReducedMotion()) return
  if (window.innerWidth < 1024) return

  // Kill leftover pin ScrollTriggers + unwrap dead pin-spacers from HMR
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === section) st.kill(true)
  })
  document.querySelectorAll('.pin-spacer').forEach((spacer) => {
    if (!spacer.contains(track)) return
    const parent = spacer.parentNode
    if (!parent) return
    while (spacer.firstChild) parent.insertBefore(spacer.firstChild, spacer)
    spacer.remove()
  })

  const getTravel = () => {
    const viewW = track.parentElement?.clientWidth ?? window.innerWidth
    const last = track.querySelector<HTMLElement>('[data-h-last]')
    // Last panel fills the viewport (rings + products + copy)
    if (last) return Math.max(0, last.offsetLeft)
    return Math.max(0, track.scrollWidth - viewW)
  }

  // No pin — `lg:h-[160vh]` on the section is the scroll length
  gsap.to(track, {
    x: () => -getTravel(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })

  track.querySelectorAll<HTMLElement>('[data-float]').forEach((el) => {
    const intensity = Number(el.dataset.float || 0.2)
    gsap.fromTo(
      el,
      { y: intensity * -50 },
      {
        y: intensity * 70,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      },
    )
  })

  track.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
    const amount = Number(el.dataset.drift || 40)
    gsap.fromTo(
      el,
      { x: amount * 0.35 },
      {
        x: -amount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      },
    )
  })

  ScrollTrigger.refresh()
}

/** Grand Hotel–style horizontal editorial — larger, overlapping, interactive */
export function HomeEditorialScroll() {
  const { groups, spaces, book } = editorialScroll
  const sectionRef = useRef<HTMLElement | null>(null)

  const scope = useGsap(() => {
    if (!scope.current) return
    sectionRef.current = scope.current
    const track = scope.current.querySelector<HTMLElement>('[data-h-track]')
    if (track) editorialMotion(scope.current, track)
  }, [])

  const onDiscover = () => {
    const section = sectionRef.current ?? scope.current
    if (section) advancePinnedScroll(section)
  }

  return (
    <section
      ref={scope}
      className="relative z-10 bg-[#6f3a44] text-warm-white lg:h-[160vh]"
    >
      {/* Desktop: sticky viewport — section height = scroll length (no pin-spacer) */}
      <div className="hidden h-screen overflow-hidden lg:sticky lg:top-0 lg:block">
        <div data-h-track className="relative flex h-full w-max gap-x-20 xl:gap-x-24">
          {/* ── Panel 1: Aura Rituals ── */}
          <div className="relative h-full w-[min(100vw,76rem)] shrink-0 overflow-hidden px-[4%]">
          <div
            aria-hidden
            data-drift="28"
            className="pointer-events-none absolute left-[58%] top-[4%] h-[min(52vw,520px)] w-[min(52vw,520px)] -translate-x-1/2 rounded-full border border-warm-white/16"
          />
          <div
            aria-hidden
            data-drift="14"
            className="pointer-events-none absolute left-[58%] top-[12%] h-[min(36vw,360px)] w-[min(36vw,360px)] -translate-x-1/2 rounded-full border border-warm-white/10"
          />

          <RitualTitle lines={groups.title} />

          {/* Craft cluster — clear of title + watermelon */}
          <div className="absolute left-[51%] top-[9%] z-20 w-[min(14.5vw,200px)]">
            <span className="mb-4 inline-flex h-8 items-center rounded-full border border-warm-white/55 px-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-warm-white/75">
              {groups.badge}
            </span>
            <Frame
              float={0.28}
              src={groups.images.secondary}
              alt={groups.images.secondaryAlt}
              to={groups.images.secondaryTo}
              className="aspect-[3/4] w-full"
            />
            <ScrollDiscover label={groups.scrollHint} onDiscover={onDiscover} />
          </div>

          {/* Primary product */}
          <Frame
            float={0.14}
            src={groups.images.primary}
            alt={groups.images.primaryAlt}
            to={groups.images.primaryTo}
            className="absolute bottom-[9%] left-[2%] z-10 h-[min(54vh,540px)] w-[min(40%,520px)]"
          />

          {/* Tall product */}
          <Frame
            float={0.1}
            src={groups.images.tall}
            alt={groups.images.tallAlt}
            to={groups.images.tallTo}
            className="absolute bottom-[7%] right-[2.5%] z-[5] h-[min(66vh,600px)] w-[min(19vw,290px)]"
          />

          {/* Copy + CTA */}
          <div className="absolute bottom-[12%] left-[min(48%,calc(2%+500px))] z-20 w-[min(26rem,28%)] max-w-[28rem]">
            <FlowBody
              paragraphs={groups.body}
              paragraphClassName="mb-6 text-[0.95rem] font-light leading-[1.75] text-warm-white/90"
            />
            <div className="mt-8">
              <RitualsCta to={groups.cta.to}>{groups.cta.label}</RitualsCta>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Spaces ── */}
        <div className="relative h-full w-[min(100vw,76rem)] shrink-0 overflow-hidden px-[4%]">
          {/* Concentric rings — behind peach / oils cluster */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[2%] top-[42%] z-0 size-[min(78vh,700px)] translate-x-[18%] -translate-y-1/2 rounded-full border border-warm-white/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[2%] top-[42%] z-0 size-[min(54vh,480px)] translate-x-[18%] -translate-y-1/2 rounded-full border border-warm-white/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[2%] top-[42%] z-0 size-[min(30vh,280px)] translate-x-[18%] -translate-y-1/2 rounded-full border border-warm-white/12"
          />

          <Frame
            float={0.14}
            src={spaces.images.hero}
            alt={spaces.images.heroAlt}
            to={spaces.images.heroTo}
            className="absolute left-[2%] top-[11%] z-10 h-[58vh] w-[min(24vw,320px)]"
          />

          <div className="absolute left-[min(30%,calc(2%+340px))] top-[18%] z-20 w-[min(32rem,34%)] max-w-[34rem] pr-4">
            <FlowBody
              paragraphs={spaces.body}
              paragraphClassName="mb-5 text-[0.95rem] font-light leading-[1.75] text-warm-white/90"
            />
            <div className="mt-9">
              <GhostPill to={spaces.cta.to}>{spaces.cta.label}</GhostPill>
            </div>
          </div>

          <RitualTitle
            lines={[spaces.title]}
            className="absolute bottom-[7%] left-[24%] z-20 font-display text-[clamp(3.25rem,6.5vw,5.5rem)] leading-[0.88] tracking-tight uppercase"
          />

          <div className="absolute right-[1%] top-[10%] h-[66vh] w-[min(28vw,400px)]">
            <Frame
              float={0.1}
              src={spaces.images.main}
              alt={spaces.images.mainAlt}
              to={spaces.images.mainTo}
              className="absolute inset-0 z-10"
            />
            <Frame
              float={0.35}
              src={spaces.images.overlap}
              alt={spaces.images.overlapAlt}
              to={spaces.images.overlapTo}
              className="absolute bottom-[-18%] left-[-40%] z-20 h-[50%] w-[66%]"
            />
            <Frame
              float={0.5}
              src={spaces.images.detail}
              alt={spaces.images.detailAlt}
              to={spaces.images.detailTo}
              className="absolute bottom-[-22%] left-[20%] z-30 h-[44%] w-[62%]"
            />
          </div>
        </div>

        {/* ── Panel 3: Shop now ── */}
        <div
          data-h-last
          className="relative h-full w-screen max-w-[100vw] shrink-0 overflow-hidden px-[5%]"
        >
          {/* Concentric rings */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[62%] top-[44%] z-0 size-[min(88vh,820px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-warm-white/22"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[62%] top-[44%] z-0 size-[min(60vh,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-warm-white/17"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[62%] top-[44%] z-0 size-[min(34vh,320px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-warm-white/13"
          />

          {/* Product cluster */}
          <div className="absolute left-[4%] top-[12%] z-10 h-[70vh] w-[min(42vw,560px)]">
            <Frame
              float={0.12}
              src={book.images.main}
              alt={book.images.mainAlt}
              to={book.images.mainTo}
              className="absolute right-0 top-0 z-10 h-[86%] w-[84%]"
            />
            <Frame
              float={0.35}
              src={book.images.overlap}
              alt={book.images.overlapAlt}
              to={book.images.overlapTo}
              className="absolute bottom-[-2%] left-0 z-20 h-[40%] w-[44%]"
            />
          </div>

          {/* Copy + text flow */}
          <div className="absolute left-[min(51%,calc(5%+600px))] top-[16%] z-30 w-[min(32rem,40%)] max-w-[34rem]">
            <RitualTitle
              lines={['Shop', 'now']}
              className="relative font-display text-[clamp(3.5rem,7vw,6.25rem)] leading-[0.88] tracking-tight uppercase"
            />
            <FlowBody
              paragraphs={book.body}
              className="mt-7"
              paragraphClassName="mb-5 text-[0.95rem] font-light leading-[1.75] text-warm-white/90"
            />
            <div className="mt-10">
              <GhostPill to={book.cta.to}>{book.cta.label}</GhostPill>
            </div>
          </div>

          <RitualTitle
            lines={['Radiant']}
            className="absolute bottom-[11%] left-[min(60%,calc(4%+700px))] z-20 font-display text-[clamp(3.25rem,6.5vw,5.5rem)] leading-[0.88] tracking-tight uppercase"
          />

          {/* Right collage — fills blank space over rings */}
          <div className="absolute right-[14%] top-[10%] z-10 h-[64vh] w-[min(28vw,380px)]">
            <Frame
              float={0.1}
              src={book.images.accent}
              alt={book.images.accentAlt}
              to={book.images.accentTo}
              className="absolute inset-0 z-10"
            />
            <Frame
              float={0.32}
              src={book.images.detail}
              alt={book.images.detailAlt}
              to={book.images.detailTo}
              className="absolute bottom-[-12%] left-[-38%] z-20 h-[46%] w-[62%]"
            />
            <Frame
              float={0.48}
              src={book.images.tertiary}
              alt={book.images.tertiaryAlt}
              to={book.images.tertiaryTo}
              className="absolute bottom-[-8%] right-[-10%] z-30 h-[38%] w-[52%]"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Mobile / tablet — larger stacked collage */}
      <div className="space-y-16 overflow-hidden px-[var(--spacing-gutter)] py-[var(--spacing-section)] sm:space-y-20 lg:hidden">
        <div>
          <h2 className="font-display text-4xl leading-[0.9] uppercase sm:text-5xl md:text-6xl">
            <span className="block">{groups.title[0]}</span>
            <span className="block">{groups.title[1]}</span>
          </h2>
          <div className="relative mt-10 max-w-md overflow-hidden">
            <Frame
              src={groups.images.primary}
              alt={groups.images.primaryAlt}
              to={groups.images.primaryTo}
              className="aspect-[5/4] w-full"
            />
            <Frame
              src={groups.images.secondary}
              alt={groups.images.secondaryAlt}
              to={groups.images.secondaryTo}
              className="absolute -bottom-6 right-0 z-10 aspect-[3/4] w-[38%] max-w-[9rem] sm:-bottom-8 sm:w-[42%]"
            />
          </div>
          <Frame
            src={groups.images.tall}
            alt={groups.images.tallAlt}
            to={groups.images.tallTo}
            className="mt-12 aspect-[3/4] w-[68%] max-w-sm sm:mt-14 sm:w-[70%]"
          />
          <div className="mt-8 max-w-md">
            {groups.body.map((p) => (
              <p key={p.slice(0, 20)} className="mb-3 text-sm text-warm-white/85">
                {p}
              </p>
            ))}
            <RitualsCta to={groups.cta.to}>{groups.cta.label}</RitualsCta>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl uppercase sm:text-5xl md:text-6xl">{spaces.title}</h2>
          <div className="relative mt-10 max-w-md overflow-hidden">
            <Frame
              src={spaces.images.hero}
              alt={spaces.images.heroAlt}
              to={spaces.images.heroTo}
              className="aspect-[3/4] w-full max-w-md"
            />
            <Frame
              src={spaces.images.overlap}
              alt={spaces.images.overlapAlt}
              to={spaces.images.overlapTo}
              className="absolute -bottom-6 right-0 z-10 aspect-[3/4] w-[42%] max-w-[10rem] sm:-bottom-8 sm:w-[48%]"
            />
          </div>
          <div className="mt-12 max-w-md">
            {spaces.body.map((p) => (
              <p key={p.slice(0, 20)} className="mb-3 text-sm text-warm-white/85">
                {p}
              </p>
            ))}
            <GhostPill to={spaces.cta.to}>{spaces.cta.label}</GhostPill>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl uppercase sm:text-5xl md:text-6xl">{book.title}</h2>
          <div className="relative mt-10 mb-8 max-w-md overflow-hidden pb-14 sm:pb-16">
            <Frame
              src={book.images.main}
              alt={book.images.mainAlt}
              to={book.images.mainTo}
              className="aspect-[4/3] w-full"
            />
            <Frame
              src={book.images.overlap}
              alt={book.images.overlapAlt}
              to={book.images.overlapTo}
              className="absolute -bottom-4 left-2 z-10 aspect-[3/4] w-[42%] max-w-[10rem] sm:w-[46%]"
            />
          </div>
          <div className="mt-6 max-w-md">
            {book.body.map((p) => (
              <p key={p.slice(0, 20)} className="mb-3 text-sm text-warm-white/85">
                {p}
              </p>
            ))}
            <GhostPill to={book.cta.to}>{book.cta.label}</GhostPill>
          </div>
        </div>
      </div>
    </section>
  )
}

const collectionAccents = [
  {
    label: 'text-[#b8975c]',
    rule: 'bg-[#b8975c]/70',
    button: 'bg-[#3d5245] text-white hover:bg-[#2f3f35]',
    productSide: 'right' as const,
  },
  {
    label: 'text-[#7b7294]',
    rule: 'bg-[#7b7294]/70',
    button: 'bg-[#7b7294] text-white hover:bg-[#685f80]',
    productSide: 'left' as const,
  },
] as const

function CollectionBanner({
  panel,
  index,
}: {
  panel: (typeof featuredSplit.panels)[number]
  index: number
}) {
  const accent = collectionAccents[index % collectionAccents.length]
  const productLeft = accent.productSide === 'left'
  const titleChars = panel.title.split('')

  const scope = useGsap(() => {
    const el = scope.current
    if (!el) return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const root = el.querySelector<HTMLElement>(
      isDesktop ? '[data-banner-desktop]' : '[data-banner-mobile]',
    )
    if (!root) return

    const labels = root.querySelectorAll('[data-banner-label]')
    const rules = root.querySelectorAll('[data-banner-rule]')
    const ctas = root.querySelectorAll('[data-banner-cta]')
    const descEls = Array.from(
      root.querySelectorAll<HTMLElement>('[data-banner-desc]'),
    )
    const titleEls = root.querySelectorAll('[data-banner-title-char]')
    const descWords = descEls.flatMap((node) => {
      const words = splitText(node, 'words')
      words.forEach((word) => {
        const outer = word.parentElement
        if (outer) outer.style.overflow = 'visible'
      })
      return words
    })

    const chrome = [...labels, ...rules, ...ctas]
    gsap.set([...chrome, ...Array.from(titleEls), ...descWords], { opacity: 0 })
    gsap.set(titleEls, { y: 14 })
    gsap.set(descWords, { y: 28 })
    gsap.set(chrome, { y: 16 })

    if (prefersReducedMotion()) {
      gsap.set([...chrome, ...Array.from(titleEls), ...descWords], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const tl = gsap.timeline({ paused: true })

    if (labels.length) {
      tl.fromTo(
        labels,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      )
    }

    if (titleEls.length) {
      tl.fromTo(
        titleEls,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.045,
          ease: 'power3.out',
        },
        '-=0.1',
      )
    }

    if (rules.length) {
      tl.fromTo(
        rules,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.35,
          transformOrigin: 'left center',
          ease: 'power3.out',
        },
        '-=0.15',
      )
    }

    if (descWords.length) {
      // Words float up into place one by one
      tl.fromTo(
        descWords,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.out',
        },
        '-=0.05',
      )
    }

    if (ctas.length) {
      tl.fromTo(
        ctas,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
        '-=0.35',
      )
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      onEnter: () => tl.restart(),
      onEnterBack: () => tl.restart(),
    })

    return () => {
      tl.kill()
      trigger.kill()
    }
  }, [panel.title, panel.description])

  return (
    <article
      ref={scope}
      className={`relative overflow-visible ${productLeft ? '' : 'pt-0 md:pt-1'}`}
    >
      {/* Mobile stacked */}
      <div
        data-banner-mobile
        className="overflow-hidden rounded-[1.35rem] bg-[#faf7f2] shadow-[0_14px_36px_rgba(70,55,25,0.1)] md:hidden"
      >        <Link
          to={panel.productTo}
          aria-label={panel.imageAlt}
          className="relative block aspect-[5/3] overflow-hidden"
        >
          <img
            src={panel.scene}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <img
            src={panel.image}
            alt={panel.imageAlt}
            className={`absolute bottom-[4%] w-auto object-contain drop-shadow-[0_12px_22px_rgba(40,30,10,0.25)] ${
              productLeft
                ? 'left-[9%] h-[112%]'
                : 'right-[-2%] h-[115%]'
            }`}
            loading="lazy"
          />
        </Link>
        <div className="px-6 py-7">
          <p
            data-banner-label
            className={`text-[0.58rem] font-medium tracking-[0.28em] uppercase ${accent.label}`}
          >
            {panel.label}
          </p>
          <h3
            className="mt-2 font-display text-[1.7rem] leading-none tracking-[0.02em] text-[#1f1c18] uppercase"
            aria-label={panel.title}
          >
            {titleChars.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                data-banner-title-char
                className="inline-block leading-none"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h3>
          <span
            data-banner-rule
            aria-hidden
            className={`mt-0.5 block h-px w-8 origin-left ${accent.rule}`}
          />
          <p
            data-banner-desc
            className="mt-4 text-[0.86rem] font-light leading-[1.65] text-[#5c574f]"
          >
            {panel.description}
          </p>
          <div data-banner-cta>
            <Link
              to={panel.to}
              className={`mt-5 inline-flex h-10 items-center gap-2.5 rounded-full py-1 pl-5 pr-1.5 text-[0.56rem] font-medium tracking-[0.16em] uppercase !text-white ${accent.button}`}
            >
              {panel.cta}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop — card size stays fixed; only peach breaks out above */}
      <div
        data-banner-desktop
        className="relative hidden h-[clamp(15rem,20vw,19.5rem)] md:block"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] shadow-[0_14px_36px_rgba(70,55,25,0.1)] lg:rounded-[2rem]">
          <img
            src={panel.scene}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <Link
          to={panel.productTo}
          aria-label={`Explore ${panel.title} collection`}
          className={`absolute top-[8%] z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-400 hover:scale-110 ${
            productLeft ? 'left-[5%]' : 'right-[5%]'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>

        <Link
          to={panel.productTo}
          aria-label={panel.imageAlt}
          className={`absolute z-30 flex items-end ${
            productLeft
              ? 'bottom-[2%] left-[8%] h-[118%] w-[54%]'
              : 'bottom-[-27%] right-[-5%] h-[195%] w-[56%]'
          }`}
        >
          <img
            src={panel.image}
            alt={panel.imageAlt}
            className={`relative mx-auto h-full w-auto max-w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] ${
              productLeft
                ? 'drop-shadow-[0_16px_28px_rgba(40,30,10,0.25)]'
                : 'drop-shadow-[0_22px_40px_rgba(40,30,10,0.28)]'
            }`}
            loading="lazy"
          />
        </Link>

        {/* Typed content in the empty cream area */}
        <div
          className={`absolute inset-y-0 z-20 flex flex-col justify-center ${
            productLeft
              ? 'left-[67%] w-[30%] items-start pr-3 lg:pr-5'
              : 'left-[10%] w-[42%] items-start pl-8 lg:pl-12'
          }`}
        >
          <p
            data-banner-label
            className={`text-[0.58rem] font-medium tracking-[0.3em] uppercase lg:text-[0.62rem] ${accent.label}`}
          >
            {panel.label}
          </p>
          <h3
            className="mt-2.5 font-display text-[clamp(1.55rem,2.6vw,2.4rem)] leading-none tracking-[0.03em] text-[#1f1c18] uppercase"
            aria-label={panel.title}
          >
            {titleChars.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                data-banner-title-char
                className="inline-block leading-none"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h3>
          <span
            data-banner-rule
            aria-hidden
            className={`mt-0.5 block h-px w-8 origin-left ${accent.rule}`}
          />
          <p
            data-banner-desc
            className="mt-4 max-w-[17rem] text-[0.82rem] font-light leading-[1.6] text-[#5c574f] lg:text-[0.88rem]"
          >
            {panel.description}
          </p>
          <div data-banner-cta className="mt-5">
            <Link
              to={panel.to}
              className={`group/cta inline-flex h-10 items-center gap-2.5 rounded-full py-1 pl-5 pr-1.5 text-[0.56rem] font-medium tracking-[0.16em] uppercase !text-white transition-colors duration-400 lg:text-[0.58rem] ${accent.button}`}
            >
              {panel.cta}
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-400 group-hover/cta:translate-x-0.5"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Collections — empty studio scenes + product overlays + typed copy */
export function HomeFeaturedSplit() {
  const {
    eyebrow,
    index,
    title,
    subtitle,
    panels,
    bridgeImage,
    bridgeImageSecondary,
    bridgeAlt,
    bridgeTo,
  } = featuredSplit
  const headerRef = useRef<HTMLElement>(null)
  const headerInView = useInView(headerRef, { threshold: 0.35 })

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const lines = el.querySelectorAll<HTMLElement>('[data-split-header]')
    if (!lines.length) return

    if (!headerInView) {
      gsap.set(lines, { opacity: 1, y: 0 })
      return
    }
    if (prefersReducedMotion()) {
      gsap.set(lines, { opacity: 1, y: 0 })
      return
    }

    gsap.set(lines, { opacity: 0, y: 22 })
    const tween = gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.14,
      ease: 'power3.out',
    })
    return () => {
      tween.kill()
    }
  }, [headerInView])

  return (
    <section className="relative z-20 bg-[#f3eee6] pt-[clamp(5rem,12vh,8.5rem)] pb-[clamp(3.5rem,8vh,6.5rem)] text-forest">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#d9cbb6]/28 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-28 h-80 w-80 rounded-full bg-[#cfc0a8]/20 blur-3xl"
      />

      {/* Bridge — overlaps burgundy editorial; must not be clipped by section overflow */}
      <Link
        to={bridgeTo}
        aria-label={bridgeAlt}
        className="absolute left-1/2 top-0 z-40 w-[min(48vw,240px)] -translate-x-1/2 -translate-y-[52%] sm:w-[min(38vw,260px)] md:w-[min(28vw,280px)]"
      >
        <div className="flex aspect-[5/4] items-end justify-center gap-1 rounded-sm bg-[#f7f1e8] px-3 pb-3 pt-4 shadow-[0_22px_50px_rgba(0,0,0,0.28)] transition-transform duration-500 hover:scale-[1.03] sm:gap-1.5 sm:px-4 sm:pb-4">
          <img
            src={bridgeImageSecondary}
            alt=""
            className="h-[92%] w-auto max-w-[46%] object-contain drop-shadow-[0_8px_16px_rgba(40,20,10,0.2)]"
            loading="lazy"
          />
          <img
            src={bridgeImage}
            alt={bridgeAlt}
            className="h-full w-auto max-w-[48%] object-contain drop-shadow-[0_8px_16px_rgba(40,20,10,0.22)]"
            loading="lazy"
          />
        </div>
      </Link>

      <p
        aria-hidden
        className="pointer-events-none absolute left-[clamp(0.5rem,4vw,3rem)] top-[clamp(2rem,6vh,4rem)] font-display text-[clamp(7rem,22vw,16rem)] leading-none tracking-tight text-forest/[0.055]"
      >
        {index}
      </p>

      <div className="relative mx-auto w-full max-w-[90rem] px-[var(--spacing-gutter)]">
        <header ref={headerRef} className="mx-auto max-w-2xl text-center">
          <p
            data-split-header
            className="text-[0.62rem] font-medium tracking-[0.34em] uppercase text-[#b8975c]"
          >
            {eyebrow}
          </p>
          <h2
            data-split-header
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.08] tracking-tight text-[#2b352c]"
          >
            {title}
          </h2>
          <span
            data-split-header
            aria-hidden
            className="mt-5 inline-flex items-center gap-3 text-[#b8975c]"
          >
            <span className="h-px w-12 bg-[#b8975c]/45 sm:w-16" />
            <Leaf className="h-3.5 w-3.5 opacity-80" strokeWidth={1.4} />
            <span className="h-px w-12 bg-[#b8975c]/45 sm:w-16" />
          </span>
          <p
            data-split-header
            className="mx-auto mt-4 max-w-lg text-[0.9rem] font-light leading-[1.7] text-[#6a645c]"
          >
            {subtitle}
          </p>
        </header>

        <div className="mt-1 space-y-4 md:mt-2 md:space-y-5">
          {panels.map((panel, i) => (
            <CollectionBanner key={panel.title} panel={panel} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

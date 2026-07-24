import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownLeft } from 'lucide-react'
import { editorialScroll, featuredSplit } from '@/data/home'
import {
  gsap,
  useGsap,
  prefersReducedMotion,
  ScrollTrigger,
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
      className="group relative inline-flex h-12 items-center overflow-hidden rounded-full border border-warm-white/80 px-9 text-micro tracking-[0.26em] uppercase text-warm-white transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(250,248,244,0.35)]"
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
      className="group relative inline-flex h-12 items-center overflow-hidden rounded-full border border-warm-white/80 px-9 text-micro tracking-[0.26em] uppercase text-warm-white"
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

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll<HTMLElement>('[data-ritual-word]')
    if (!words.length) return

    timelineRef.current?.kill()
    timelineRef.current = null

    if (!inView) {
      // Stay readable inside the horizontal track even if IO flickers
      gsap.set(words, { y: 0, opacity: 1 })
      return
    }

    if (prefersReducedMotion()) {
      gsap.set(words, { y: 0, opacity: 1 })
      return
    }

    gsap.set(words, { y: '110%', opacity: 0 })

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.55,
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
        className="h-full w-full object-contain p-[4%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-110"
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
      className="relative bg-[#6f3a44] text-warm-white lg:h-[160vh]"
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
              className="aspect-[3/4] w-full rotate-[-1.5deg]"
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
            lines={['Radient']}
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
              className="absolute bottom-[-12%] left-[-38%] z-20 h-[46%] w-[62%] rotate-[-3deg]"
            />
            <Frame
              float={0.48}
              src={book.images.tertiary}
              alt={book.images.tertiaryAlt}
              to={book.images.tertiaryTo}
              className="absolute bottom-[-8%] right-[-10%] z-30 h-[38%] w-[52%] rotate-[2.5deg]"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Mobile / tablet — larger stacked collage */}
      <div className="space-y-20 px-[var(--spacing-gutter)] py-[var(--spacing-section)] lg:hidden">
        <div>
          <h2 className="font-display text-5xl leading-[0.9] uppercase sm:text-6xl">
            <span className="block">{groups.title[0]}</span>
            <span className="block">{groups.title[1]}</span>
          </h2>
          <div className="relative mt-10">
            <Frame
              src={groups.images.primary}
              alt={groups.images.primaryAlt}
              to={groups.images.primaryTo}
              className="aspect-[5/4] w-[92%]"
            />
            <Frame
              src={groups.images.secondary}
              alt={groups.images.secondaryAlt}
              to={groups.images.secondaryTo}
              className="absolute -bottom-8 right-0 z-10 aspect-[3/4] w-[42%] rotate-[-2deg]"
            />
          </div>
          <Frame
            src={groups.images.tall}
            alt={groups.images.tallAlt}
            to={groups.images.tallTo}
            className="mt-14 aspect-[3/4] w-[70%] max-w-sm"
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
          <h2 className="font-display text-5xl uppercase sm:text-6xl">{spaces.title}</h2>
          <div className="relative mt-10">
            <Frame
              src={spaces.images.hero}
              alt={spaces.images.heroAlt}
              to={spaces.images.heroTo}
              className="aspect-[3/4] w-[85%] max-w-md"
            />
            <Frame
              src={spaces.images.overlap}
              alt={spaces.images.overlapAlt}
              to={spaces.images.overlapTo}
              className="absolute -bottom-8 right-0 z-10 aspect-[3/4] w-[48%] rotate-[-3deg]"
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
          <h2 className="font-display text-5xl uppercase sm:text-6xl">{book.title}</h2>
          <div className="relative mt-10 mb-8 pb-16">
            <Frame
              src={book.images.main}
              alt={book.images.mainAlt}
              to={book.images.mainTo}
              className="aspect-[4/3] w-[90%]"
            />
            <Frame
              src={book.images.overlap}
              alt={book.images.overlapAlt}
              to={book.images.overlapTo}
              className="absolute -bottom-4 left-2 z-10 aspect-[3/4] w-[46%] rotate-[-4deg]"
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

/** Skin & Oils split — aligned products, black veil → glow on hover */
export function HomeFeaturedSplit() {
  const { title, badge, bridgeImage, bridgeAlt, panels } = featuredSplit

  return (
    <section className="relative bg-[#0c0a09] text-warm-white">
      <div className="pointer-events-none absolute left-1/2 top-0 z-30 hidden w-[min(26vw,260px)] -translate-x-1/2 -translate-y-[42%] md:block">
        <div className="overflow-hidden border border-warm-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <img
            src={bridgeImage}
            alt={bridgeAlt}
            className="aspect-[5/4] w-full object-contain bg-[#1a1210] p-3"
            loading="lazy"
          />
        </div>
      </div>

      <div className="relative grid min-h-[100svh] md:grid-cols-2">
        <h2 className="pointer-events-none absolute inset-x-0 top-[clamp(5.5rem,12vh,8rem)] z-20 text-center font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight uppercase">
          {title}
        </h2>

        {panels.map((panel, index) => (
          <Link
            key={panel.title}
            to={panel.to}
            className="group relative min-h-[85vh] overflow-hidden md:min-h-[100svh]"
          >
            <div className="absolute inset-0 bg-[#0c0a09]">
              <div className="absolute left-1/2 top-[16%] aspect-square w-[min(78%,540px)] -translate-x-1/2 md:top-[14%] md:w-[min(82%,560px)]">
                <img
                  src={panel.image}
                  alt={panel.imageAlt}
                  className="h-full w-full object-contain object-center brightness-[0.55] contrast-110 opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:brightness-110 group-hover:opacity-100 group-hover:drop-shadow-[0_0_48px_rgba(212,184,122,0.55)]"
                  loading="lazy"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/70 to-black/50 transition-opacity duration-700 group-hover:opacity-0" />
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-transparent to-black/25" />
            </div>

            {index === 0 && (
              <div className="absolute left-6 top-[clamp(10rem,22vh,14rem)] z-20 md:left-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-warm-white/55 px-3.5 py-1.5 text-micro tracking-[0.18em] uppercase text-warm-white/80">
                  <span className="h-4 w-4 rounded-full border border-warm-white/60" />
                  {badge}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-10 md:pb-16 lg:px-14">
              <h3 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-tight uppercase transition-transform duration-500 group-hover:-translate-y-1">
                {panel.title}
              </h3>
              <p className="mt-4 max-w-[18rem] text-micro tracking-[0.18em] uppercase leading-relaxed text-warm-white/80">
                {panel.description}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 border-b border-warm-white pb-1 text-micro tracking-[0.22em] uppercase transition-all duration-300 group-hover:gap-3 group-hover:border-soft-gold group-hover:text-soft-gold">
                More info
                <span aria-hidden>↗</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { ArrowDownLeft } from 'lucide-react'
import { editorialScroll, featuredSplit } from '@/data/home'
import { gsap, useGsap, horizontalPin, prefersReducedMotion } from '@animations/gsap'

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
      className="inline-flex items-center justify-center rounded-full border border-warm-white/80 px-9 py-3 text-micro tracking-[0.22em] uppercase text-warm-white transition-all duration-400 hover:scale-105 hover:bg-warm-white hover:text-[#5c2f38]"
    >
      {children}
    </Link>
  )
}

function Frame({
  src,
  alt,
  className,
  float,
}: {
  src: string
  alt: string
  className?: string
  /** Parallax intensity while the section scrolls */
  float?: number
}) {
  return (
    <div
      data-float={float ?? undefined}
      className={`group/frame overflow-hidden border border-warm-white/90 bg-[#f3ebe3]/20 shadow-[0_28px_60px_rgba(0,0,0,0.28)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-30 hover:scale-[1.04] ${className ?? ''}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain p-[4%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-110"
        loading="lazy"
        draggable={false}
      />
    </div>
  )
}

function editorialMotion(section: HTMLElement, track: HTMLElement) {
  if (prefersReducedMotion()) return
  if (window.innerWidth < 1024) return

  horizontalPin(section, track)

  const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

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
          end: () => `+=${getScroll()}`,
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
          end: () => `+=${getScroll()}`,
          scrub: 1.2,
        },
      },
    )
  })
}

/** Grand Hotel–style horizontal editorial — larger, overlapping, interactive */
export function HomeEditorialScroll() {
  const { groups, spaces, book } = editorialScroll

  const scope = useGsap(() => {
    if (!scope.current) return
    const track = scope.current.querySelector<HTMLElement>('[data-h-track]')
    if (track) editorialMotion(scope.current, track)
  }, [])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[#6f3a44] text-warm-white"
    >
      {/* Desktop: pinned horizontal journey */}
      <div data-h-track className="hidden w-max lg:flex">
        {/* ── Panel 1: Aura Rituals ── */}
        <div className="relative h-screen w-screen shrink-0 overflow-hidden">
          <div
            aria-hidden
            data-drift="60"
            className="pointer-events-none absolute left-[48%] top-[8%] h-[min(68vw,620px)] w-[min(68vw,620px)] -translate-x-1/2 rounded-full border border-warm-white/20"
          />
          <div
            aria-hidden
            data-drift="30"
            className="pointer-events-none absolute left-[48%] top-[18%] h-[min(48vw,440px)] w-[min(48vw,440px)] -translate-x-1/2 rounded-full border border-warm-white/12"
          />

          <h2
            data-drift="20"
            className="absolute left-[4%] top-[6%] z-20 font-display text-[clamp(4rem,8.5vw,7.5rem)] leading-[0.86] tracking-tight uppercase"
          >
            <span className="block">{groups.title[0]}</span>
            <span className="block">{groups.title[1]}</span>
          </h2>

          <div className="absolute left-[40%] top-[5%] z-20 hidden xl:block">
            <span className="inline-flex h-10 items-center rounded-full border border-warm-white/55 px-5 text-micro tracking-[0.2em] text-warm-white/75">
              {groups.badge}
            </span>
          </div>

          {/* Primary — large landscape, overlaps secondary */}
          <Frame
            float={0.18}
            src={groups.images.primary}
            alt={groups.images.primaryAlt}
            className="absolute bottom-[8%] left-[2%] z-10 h-[52vh] w-[46vw] max-w-[680px]"
          />

          {/* Secondary — overlaps primary top-right */}
          <div className="absolute left-[40%] top-[12%] z-20 w-[18vw] max-w-[240px]">
            <Frame
              float={0.35}
              src={groups.images.secondary}
              alt={groups.images.secondaryAlt}
              className="aspect-[3/4] w-full rotate-[-2deg]"
            />
            <p className="mt-6 flex items-center gap-2 text-micro tracking-[0.2em] uppercase text-warm-white/75">
              <ArrowDownLeft className="h-3.5 w-3.5 animate-pulse" strokeWidth={1.25} />
              {groups.scrollHint}
            </p>
          </div>

          {/* Tall — bleeds off right, overlaps secondary */}
          <Frame
            float={0.12}
            src={groups.images.tall}
            alt={groups.images.tallAlt}
            className="absolute right-[-2%] top-[4%] z-[5] h-[88vh] w-[28vw] max-w-[380px]"
          />

          <div className="absolute bottom-[10%] left-[48%] z-20 max-w-[280px]">
            {groups.body.map((p) => (
              <p
                key={p.slice(0, 20)}
                className="mb-3 text-[0.8125rem] leading-relaxed text-warm-white/88"
              >
                {p}
              </p>
            ))}
            <div className="mt-6">
              <GhostPill to={groups.cta.to}>{groups.cta.label}</GhostPill>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Spaces ── */}
        <div className="relative h-screen w-screen shrink-0 overflow-hidden">
          <Frame
            float={0.15}
            src={spaces.images.hero}
            alt={spaces.images.heroAlt}
            className="absolute left-[-1%] top-[6%] z-10 h-[82vh] w-[38vw] max-w-[520px]"
          />

          <div className="absolute left-[36%] top-[10%] z-20 max-w-[300px]">
            {spaces.body.map((p) => (
              <p
                key={p.slice(0, 20)}
                className="mb-3 text-[0.8125rem] leading-relaxed text-warm-white/88"
              >
                {p}
              </p>
            ))}
            <div className="mt-6">
              <GhostPill to={spaces.cta.to}>{spaces.cta.label}</GhostPill>
            </div>
          </div>

          <h2
            data-drift="50"
            className="absolute bottom-[6%] left-[32%] z-20 font-display text-[clamp(4.5rem,10vw,8.5rem)] leading-none tracking-tight uppercase"
          >
            {spaces.title}
          </h2>

          {/* Right collage — bigger overlaps */}
          <div className="absolute right-[2%] top-[5%] h-[80vh] w-[34vw] max-w-[460px]">
            <Frame
              float={0.1}
              src={spaces.images.main}
              alt={spaces.images.mainAlt}
              className="absolute inset-0 z-10"
            />
            <Frame
              float={0.4}
              src={spaces.images.overlap}
              alt={spaces.images.overlapAlt}
              className="absolute bottom-[-6%] left-[-22%] z-20 h-[44%] w-[58%] rotate-[-3deg]"
            />
            <Frame
              float={0.55}
              src={spaces.images.detail}
              alt={spaces.images.detailAlt}
              className="absolute bottom-[-10%] left-[32%] z-30 h-[28%] w-[52%] rotate-[2deg]"
            />
          </div>
        </div>

        {/* ── Panel 3: Shop now ── */}
        <div className="relative h-screen w-screen shrink-0 overflow-hidden">
          <div className="absolute left-[3%] top-[6%] h-[78vh] w-[50vw] max-w-[700px]">
            <Frame
              float={0.14}
              src={book.images.main}
              alt={book.images.mainAlt}
              className="absolute inset-0 z-10"
            />
            <Frame
              float={0.45}
              src={book.images.overlap}
              alt={book.images.overlapAlt}
              className="absolute bottom-[-8%] left-[-12%] z-20 h-[48%] w-[42%] rotate-[-4deg]"
            />
          </div>

          <div className="absolute right-[6%] top-[14%] z-20 max-w-[360px]">
            <h2
              data-drift="25"
              className="font-display text-[clamp(3.25rem,6.5vw,6rem)] leading-[0.9] tracking-tight uppercase"
            >
              {book.title}
            </h2>
            {book.body.map((p) => (
              <p
                key={p.slice(0, 20)}
                className="mt-6 text-[0.8125rem] leading-relaxed text-warm-white/88"
              >
                {p}
              </p>
            ))}
            <div className="mt-10">
              <GhostPill to={book.cta.to}>{book.cta.label}</GhostPill>
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
              className="aspect-[5/4] w-[92%]"
            />
            <Frame
              src={groups.images.secondary}
              alt={groups.images.secondaryAlt}
              className="absolute -bottom-8 right-0 z-10 aspect-[3/4] w-[42%] rotate-[-2deg]"
            />
          </div>
          <Frame
            src={groups.images.tall}
            alt={groups.images.tallAlt}
            className="mt-14 aspect-[3/4] w-[70%] max-w-sm"
          />
          <div className="mt-8 max-w-md">
            {groups.body.map((p) => (
              <p key={p.slice(0, 20)} className="mb-3 text-sm text-warm-white/85">
                {p}
              </p>
            ))}
            <GhostPill to={groups.cta.to}>{groups.cta.label}</GhostPill>
          </div>
        </div>

        <div>
          <h2 className="font-display text-5xl uppercase sm:text-6xl">{spaces.title}</h2>
          <div className="relative mt-10">
            <Frame
              src={spaces.images.hero}
              alt={spaces.images.heroAlt}
              className="aspect-[3/4] w-[85%] max-w-md"
            />
            <Frame
              src={spaces.images.overlap}
              alt={spaces.images.overlapAlt}
              className="absolute -bottom-6 right-0 z-10 aspect-[3/4] w-[40%] rotate-[-3deg]"
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
          <div className="relative mt-10">
            <Frame
              src={book.images.main}
              alt={book.images.mainAlt}
              className="aspect-[4/3] w-[90%]"
            />
            <Frame
              src={book.images.overlap}
              alt={book.images.overlapAlt}
              className="absolute -bottom-8 left-4 z-10 aspect-[3/4] w-[38%] rotate-[-4deg]"
            />
          </div>
          <div className="mt-14 max-w-md">
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

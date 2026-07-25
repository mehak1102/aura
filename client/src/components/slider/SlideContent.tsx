import { forwardRef, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { LuxurySlide } from './types'

type SlideContentProps = {
  slide: LuxurySlide
  eyebrow?: string
  index: number
  total: number
  dotsRef?: RefObject<HTMLDivElement | null>
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
  disabled?: boolean
}

function Title({ slide }: { slide: LuxurySlide }) {
  if (slide.titleLines) {
    return (
      <h2
        data-copy-title
        className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-forest"
      >
        <span data-copy-title-a className="block text-[clamp(2.4rem,4.2vw,3.75rem)]">
          {slide.titleLines[0]}
        </span>
        <span data-copy-title-b className="block text-[clamp(2.4rem,4.2vw,3.75rem)]">
          {slide.titleLines[1]}
        </span>
      </h2>
    )
  }

  return (
    <h2
      data-copy-title
      className="font-display text-[clamp(2.4rem,4vw,3.5rem)] uppercase leading-[0.92] tracking-[-0.02em] text-forest"
    >
      <span data-copy-title-a className="block">
        {slide.title}
      </span>
      <span data-copy-title-b className="hidden" />
    </h2>
  )
}

function CopyPanel({
  slide,
  eyebrow,
  index,
}: {
  slide: LuxurySlide
  eyebrow: string
  index: number
}) {
  const slideNum = String(index + 1).padStart(2, '0')

  return (
    <>
      <div className="flex items-center gap-4">
        <span
          data-copy-num
          className="font-display text-[clamp(2.75rem,4vw,3.5rem)] leading-none text-soft-gold"
        >
          {slideNum}
        </span>
        <span className="flex items-center gap-3">
          <span className="h-px w-6 bg-soft-gold/60" />
          <span className="text-[0.65rem] font-semibold tracking-[0.34em] uppercase text-charcoal-muted">
            {eyebrow}
          </span>
        </span>
      </div>

      <div className="mt-6">
        <Title slide={slide} />
        <span className="mt-4 block h-px w-14 bg-soft-gold" />
      </div>

      <p
        data-copy-subtitle
        className="mt-5 text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-olive"
      >
        {slide.subtitle}
      </p>

      <p
        data-copy-description
        className="mt-4 max-w-[24rem] text-[1rem] font-light leading-[1.75] text-charcoal-muted"
      >
        {slide.description}
      </p>

      {slide.cta ? (
        <Link
          data-copy-cta
          to={slide.cta.to}
          className="group mt-7 inline-flex h-12 w-fit items-center gap-2.5 rounded-full border border-forest/30 bg-transparent px-8 text-[0.65rem] font-semibold tracking-[0.26em] uppercase text-forest transition-colors duration-400 hover:border-soft-gold hover:bg-soft-gold/10"
        >
          <span data-copy-cta-label>{slide.cta.label}</span>
          <span
            aria-hidden
            className="inline-flex text-soft-gold transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </Link>
      ) : (
        <span data-copy-cta className="hidden" />
      )}
    </>
  )
}

/** Empty shell used as the continuity layer — filled by GSAP before each transition. */
function CopyIncomingShell({ eyebrow }: { eyebrow: string }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <span
          data-copy-num
          className="font-display text-[clamp(2.75rem,4vw,3.5rem)] leading-none text-soft-gold"
        />
        <span className="flex items-center gap-3">
          <span className="h-px w-6 bg-soft-gold/60" />
          <span className="text-[0.65rem] font-semibold tracking-[0.34em] uppercase text-charcoal-muted">
            {eyebrow}
          </span>
        </span>
      </div>

      <div className="mt-6">
        <h2
          data-copy-title
          className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-forest"
        >
          <span data-copy-title-a className="block text-[clamp(2.4rem,4.2vw,3.75rem)]" />
          <span data-copy-title-b className="block text-[clamp(2.4rem,4.2vw,3.75rem)]" />
        </h2>
        <span className="mt-4 block h-px w-14 bg-soft-gold" />
      </div>

      <p
        data-copy-subtitle
        className="mt-5 text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-olive"
      />

      <p
        data-copy-description
        className="mt-4 max-w-[24rem] text-[1rem] font-light leading-[1.75] text-charcoal-muted"
      />

      <a
        data-copy-cta
        href="#"
        className="group mt-7 inline-flex h-12 w-fit items-center gap-2.5 rounded-full border border-forest/30 bg-transparent px-8 text-[0.65rem] font-semibold tracking-[0.26em] uppercase text-forest transition-colors duration-400 hover:border-soft-gold hover:bg-soft-gold/10"
      >
        <span data-copy-cta-label />
        <span
          aria-hidden
          className="inline-flex text-soft-gold transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </a>
    </>
  )
}

/** Light editorial copy — forest ink on linen. */
export const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(
  function SlideContent(
    {
      slide,
      eyebrow = 'Botanical collection',
      index,
      total,
      dotsRef,
      onPrev,
      onNext,
      onSelect,
      disabled,
    },
    ref,
  ) {
    const slideNum = String(index + 1).padStart(2, '0')
    const totalNum = String(total).padStart(2, '0')
    const progress = total > 1 ? index / (total - 1) : 1

    return (
      <div
        ref={ref}
        className="relative z-10 flex h-full min-h-0 flex-col justify-center self-center overflow-x-clip py-2"
      >
        <div className="relative min-h-0 overflow-x-clip pb-1">
          {/* Current copy panel */}
          <div data-copy-panel className="pb-0.5 will-change-transform">
            <CopyPanel slide={slide} eyebrow={eyebrow} index={index} />
          </div>

          {/* Incoming copy panel — slides in as continuous next frame */}
          <div
            data-copy-incoming-panel
            aria-hidden
            className="pointer-events-none absolute inset-0 pb-0.5 opacity-0 will-change-transform"
            style={{ visibility: 'hidden' }}
          >
            <CopyIncomingShell eyebrow={eyebrow} />
          </div>
        </div>

        {/* Pagination stays put — outside the sliding text track */}
        <div ref={dotsRef} className="mt-10 flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={onPrev}
            disabled={disabled}
            className="flex h-9 w-9 items-center justify-center text-forest/55 transition-colors duration-300 hover:text-forest disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <span className="text-[0.88rem] tabular-nums tracking-wide text-forest/75">
            {slideNum}
            <span className="text-forest/30"> / </span>
            {totalNum}
          </span>

          <div
            className="relative h-px max-w-[9rem] flex-1 bg-forest/15"
            role="tablist"
            aria-label="Slides"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-forest transition-[width] duration-500 ease-[var(--ease-out-expo)]"
              style={{ width: `${Math.max(progress * 100, 8)}%` }}
            />
            <div className="absolute inset-0 flex">
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => onSelect(i)}
                  disabled={disabled}
                  className="h-full flex-1"
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next slide"
            onClick={onNext}
            disabled={disabled}
            className="flex h-9 w-9 items-center justify-center text-forest/55 transition-colors duration-300 hover:text-olive disabled:opacity-35"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    )
  },
)

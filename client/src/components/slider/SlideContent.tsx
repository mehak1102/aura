import { forwardRef, type RefObject } from 'react'
import { Link } from 'react-router-dom'
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
      <h2 className="font-display uppercase leading-[0.88] tracking-[-0.03em] text-forest">
        <span className="block text-[clamp(2.4rem,4.8vw,4rem)]">{slide.titleLines[0]}</span>
        <span className="block pl-[0.28em] text-[clamp(2.4rem,4.8vw,4rem)] text-forest/88">
          {slide.titleLines[1]}
        </span>
      </h2>
    )
  }

  return (
    <h2 className="font-display text-[clamp(2.2rem,4.2vw,3.6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-forest">
      {slide.title}
    </h2>
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

    return (
      <div
        ref={ref}
        className="relative z-10 flex h-full flex-col justify-center py-8 lg:py-12"
      >
        <p
          aria-hidden
          className="pointer-events-none absolute -left-2 top-4 select-none font-display text-[clamp(5rem,14vw,9rem)] leading-none text-forest/[0.05] lg:top-0"
        >
          {slideNum}
        </p>

        <p
          data-slide-part
          className="relative text-[0.62rem] font-semibold tracking-[0.36em] uppercase text-olive"
        >
          {eyebrow}
        </p>

        <div
          data-slide-part
          className="relative mt-5 h-px w-14 origin-left bg-gradient-to-r from-soft-gold via-soft-gold/50 to-transparent"
        />

        <div data-slide-part className="relative mt-8">
          <Title slide={slide} />
        </div>

        <p
          data-slide-part
          className="relative mt-5 text-[0.62rem] font-medium tracking-[0.3em] uppercase text-charcoal-muted"
        >
          {slide.subtitle}
        </p>

        <p
          data-slide-part
          className="relative mt-4 max-w-[22rem] text-[0.9rem] font-light leading-[1.8] text-charcoal-muted"
        >
          {slide.description}
        </p>

        {slide.cta && (
          <Link
            data-slide-part
            to={slide.cta.to}
            className="group relative mt-8 inline-flex w-fit items-center gap-2.5 border-b border-forest/25 pb-1 text-[0.62rem] font-semibold tracking-[0.28em] uppercase text-forest transition-[border-color,color] duration-500 hover:border-soft-gold hover:text-olive"
          >
            {slide.cta.label}
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}

        <div ref={dotsRef} className="relative mt-12 flex items-center gap-3 lg:mt-14">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={onPrev}
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center text-forest/50 transition-colors duration-300 hover:text-forest disabled:opacity-35"
          >
            ←
          </button>
          <span className="min-w-[4.25rem] text-[0.78rem] tabular-nums tracking-wide text-forest/70">
            {slideNum}
            <span className="text-forest/30"> / </span>
            {totalNum}
          </span>
          <div className="hidden items-center gap-1.5 sm:flex" role="tablist" aria-label="Slides">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => onSelect(i)}
                disabled={disabled}
                className={`h-1 rounded-full transition-all duration-400 disabled:opacity-35 ${
                  i === index
                    ? 'w-7 bg-forest'
                    : 'w-1.5 bg-forest/20 hover:bg-forest/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={onNext}
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center text-forest/50 transition-colors duration-300 hover:text-olive disabled:opacity-35"
          >
            →
          </button>
        </div>
      </div>
    )
  },
)

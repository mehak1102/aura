import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@utils/index'
import type { splitJourney } from '@/data/home'

export type SplitJourneySlide = (typeof splitJourney.slides)[number]

function splitDescriptionLines(text: string) {
  const words = text.trim().split(/\s+/)
  if (words.length <= 7) return [text]
  const mid = Math.ceil(words.length * 0.55)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function TitleWords({
  lines,
  italic,
}: {
  lines: string[]
  italic?: string
}) {
  const italicWords = new Set(
    (italic ?? '')
      .toLowerCase()
      .replace(/[.,]/g, '')
      .split(/\s+/)
      .filter(Boolean),
  )

  return (
    <>
      {lines.map((line, li) => {
        const words = line.split(/\s+/).filter(Boolean)
        return (
          <span key={`${line}-${li}`} className="block">
            {words.map((word, wi) => {
              const plain = word.toLowerCase().replace(/[.,]/g, '')
              const isEm = italicWords.has(plain)
              return (
                <span key={`${li}-${wi}`}>
                  {wi > 0 ? ' ' : null}
                  <span className="inline-block overflow-hidden align-bottom">
                    <span
                      data-journey-word=""
                      className={cn(
                        'inline-block will-change-transform',
                        isEm ? 'italic text-[#d4b87a]' : 'text-[#f7f3ea]',
                      )}
                    >
                      {isEm ? <em className="font-normal italic">{word}</em> : word}
                    </span>
                  </span>
                </span>
              )
            })}
          </span>
        )
      })}
    </>
  )
}

type JourneyMediaProps = {
  slides: SplitJourneySlide[]
  className?: string
}

/** Absolute image stack — vertical slide transitions driven by parent timeline */
export function JourneyMediaPanel({ slides, className }: JourneyMediaProps) {
  return (
    <div
      data-journey-media
      className={cn('relative h-full w-full overflow-hidden bg-[#dfe6d8]', className)}
    >
      {slides.map((slide, i) => (
        <figure
          key={slide.id}
          data-journey-image
          data-index={i}
          className="absolute inset-0 m-0 h-full w-full overflow-hidden will-change-transform"
          style={{
            zIndex: slides.length - i,
          }}
        >
          <img
            src={slide.image}
            alt={slide.imageAlt}
            width={1200}
            height={1500}
            decoding="async"
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className="block h-full w-full object-cover object-center"
            draggable={false}
          />
        </figure>
      ))}
    </div>
  )
}

type JourneyCopyProps = {
  slides: SplitJourneySlide[]
  total: number
  className?: string
}

/** Blurred copy bg uses the *next* slide (last → first) so it never mirrors the media panel. */
function copyBackgroundSrc(slides: SplitJourneySlide[], index: number) {
  return slides[(index + 1) % slides.length]?.image ?? slides[index].image
}

/** Text panel — content layers crossfade via GSAP */
export function JourneyCopyPanel({ slides, total, className }: JourneyCopyProps) {
  return (
    <div
      data-journey-copy
      className={cn('relative h-full w-full overflow-hidden bg-[#3e4736]', className)}
    >
      {slides.map((slide, i) => {
        const descLines = splitDescriptionLines(slide.description)
        const bgSrc = copyBackgroundSrc(slides, i)
        return (
          <div
            key={slide.id}
            data-journey-copy-layer
            data-index={i}
            className="absolute inset-0 flex flex-col justify-center overflow-hidden"
            style={{
              opacity: i === 0 ? 1 : 0,
              transform: 'translateY(0px)',
              pointerEvents: i === 0 ? 'auto' : 'none',
            }}
          >
            <img
              src={bgSrc}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center blur-[3px] opacity-95"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div aria-hidden className="absolute inset-0 bg-[#2f3829]/32" />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#2a3324]/55 via-[#2a3324]/28 to-[#2a3324]/15"
            />

            <div className="relative z-[1] flex h-full flex-col justify-center px-[clamp(1.75rem,4vw,3.5rem)] py-10">
              <div data-journey-meta="" className="flex items-center gap-3">
                <span className="font-display text-[1.15rem] tabular-nums tracking-wide text-[#e8dcc8] sm:text-[1.25rem]">
                  {slide.step}
                </span>
                <span aria-hidden className="h-px w-10 bg-[#d4b87a]/70" />
                <span className="text-[0.65rem] font-medium tracking-[0.28em] uppercase text-[#d4b87a]/85 sm:text-[0.7rem]">
                  of {String(total).padStart(2, '0')}
                </span>
              </div>

              <p
                data-journey-meta=""
                className="mt-7 text-[0.72rem] font-medium tracking-[0.32em] uppercase text-[#d4b87a] sm:text-[0.78rem]"
              >
                {slide.label}
              </p>

              <h3 className="mt-4 max-w-[16ch] font-display text-[clamp(2.35rem,4.2vw,3.55rem)] leading-[1.06] tracking-tight text-[#f7f3ea] text-pretty">
                <TitleWords lines={slide.titleLines} italic={slide.titleItalic} />
              </h3>

              <div className="mt-6 max-w-[34rem] space-y-0">
                {descLines.map((line) => (
                  <p
                    key={line}
                    data-journey-line=""
                    className="text-[1.05rem] font-light leading-[1.7] text-[#ebe6dc] text-pretty sm:text-[1.12rem] sm:leading-[1.75]"
                  >
                    {line}
                  </p>
                ))}
              </div>

              <p
                data-journey-meta=""
                className="mt-5 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-[#d4b87a] sm:text-[0.72rem]"
              >
                {slide.note}
              </p>

              <div data-journey-meta="" className="mt-9">
                <Link
                  to={slide.cta.to}
                  className="group/cta inline-flex h-12 items-center gap-2.5 rounded-full border border-[#d4b87a]/70 bg-transparent px-8 text-[0.68rem] font-semibold tracking-[0.2em] uppercase !text-white transition-colors duration-400 hover:border-[#d4b87a] hover:bg-[#d4b87a]/18 hover:!text-white sm:h-[3.25rem] sm:text-[0.72rem]"
                  style={{ color: '#ffffff' }}
                >
                  {slide.cta.label}
                  <ArrowRight
                    className="h-3.5 w-3.5 !text-white transition-transform duration-400 group-hover/cta:translate-x-0.5"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Mobile fallback — stacked cards matching Shop by Concern */
export function JourneyMobileStack({ slides }: { slides: SplitJourneySlide[] }) {
  return (
    <div className="space-y-6">
      {slides.map((slide, i) => (
        <article
          key={slide.id}
          className="overflow-hidden rounded-[1.25rem] bg-[#3e4736] shadow-[0_1px_0_rgba(36,53,40,0.04)] ring-1 ring-[#243528]/20"
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-[#dfe6d8]">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="relative overflow-hidden px-6 py-7">
            <img
              src={copyBackgroundSrc(slides, i)}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center blur-[3px] opacity-95"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-0 bg-[#2f3829]/45" />
            <div className="relative z-[1]">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[0.85rem] tabular-nums text-[#e8dcc8]">
                {slide.step}
              </span>
              <span aria-hidden className="h-px w-6 bg-[#d4b87a]/60" />
              <p className="text-[0.55rem] font-medium tracking-[0.28em] uppercase text-[#d4b87a]">
                {slide.label}
              </p>
            </div>
            <h3 className="mt-3 font-display text-[1.85rem] leading-[1.1] tracking-tight text-[#f7f3ea]">
              <TitleWords lines={slide.titleLines} italic={slide.titleItalic} />
            </h3>
            <p className="mt-3 text-[1rem] font-light leading-[1.7] text-[#ebe6dc]">
              {slide.description}
            </p>
            <p className="mt-3 text-[0.55rem] font-medium tracking-[0.16em] uppercase text-[#d4b87a]">
              {slide.note}
            </p>
            <Link
              to={slide.cta.to}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-[#d4b87a]/70 px-6 text-[0.58rem] font-semibold tracking-[0.2em] uppercase !text-white transition-colors hover:border-[#d4b87a] hover:bg-[#d4b87a]/18 hover:!text-white"
              style={{ color: '#ffffff' }}
            >
              {slide.cta.label}
              <ArrowRight className="h-3.5 w-3.5 !text-white" stroke="currentColor" strokeWidth={1.75} />
            </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

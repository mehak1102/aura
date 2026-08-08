import { Body, Display, Eyebrow } from '@components/ui'
import { useGsap, expandBentoGallery, rollHeadingChars } from '@animations/gsap'

type BentoImage = {
  src: string
  alt: string
}

type BentoHeroProps = {
  eyebrow: string
  title: string
  description?: string
  /** Small scroll cue under the copy */
  hint?: string
  /** Eight tiles — see `storyBento` for the slot shapes */
  images: BentoImage[]
}

/** Full-screen bento gallery that zooms open as the section stays pinned. */
export function BentoHero({
  eyebrow,
  title,
  description,
  hint,
  images,
}: BentoHeroProps) {
  const scope = useGsap(() => {
    if (!scope.current) return
    rollHeadingChars(scope.current)
    return expandBentoGallery(scope.current)
  }, [])

  return (
    <section ref={scope} className="bento-hero">
      <div className="bento-grid" data-bento-grid="">
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="bento-grid__item" data-bento-item="">
            <img
              src={image.src}
              alt={image.alt}
              loading={index < 4 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="bento-hero__veil" data-bento-veil="" aria-hidden />

      <div className="bento-hero__copy" data-bento-copy="">
        <Eyebrow tone="gold">{eyebrow}</Eyebrow>
        <Display
          as="h1"
          size="xl"
          className="mt-4 max-w-3xl text-[clamp(1.65rem,6.5vw,3.5rem)] text-forest"
          data-char-roll=""
        >
          {title}
        </Display>
        {description && (
          <Body muted className="mt-4 max-w-xl text-[0.88rem] leading-relaxed sm:mt-5 lg:text-body-lg">
            {description}
          </Body>
        )}
        {hint && (
          <span className="mt-6 inline-flex items-center gap-3 text-[0.58rem] tracking-[0.22em] text-olive uppercase sm:mt-8 sm:text-micro sm:tracking-[0.28em] lg:gap-3">
            <span className="h-px w-8 bg-soft-gold/60 sm:w-10" />
            {hint}
          </span>
        )}
      </div>
    </section>
  )
}

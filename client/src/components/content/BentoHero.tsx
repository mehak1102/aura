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
          <div key={image.src} className="bento-grid__item" data-bento-item="">
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
          className="mt-4 max-w-3xl text-forest"
          data-char-roll=""
        >
          {title}
        </Display>
        {description && (
          <Body muted className="mt-5 max-w-xl lg:text-body-lg">
            {description}
          </Body>
        )}
        {hint && (
          <span className="mt-8 hidden items-center gap-3 text-micro tracking-[0.28em] text-olive uppercase lg:inline-flex">
            <span className="h-px w-10 bg-soft-gold/60" />
            {hint}
          </span>
        )}
      </div>
    </section>
  )
}

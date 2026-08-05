import type { ReactNode } from 'react'
import { Body, Display, Eyebrow } from '@components/ui'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'
import { cn } from '@utils/index'

type EditorialHeroProps = {
  eyebrow: string
  title: string
  description?: string
  image?: string
  imageAlt?: string
  /** Gold leaf rule between title and description */
  withLeafRule?: boolean
  /** Soft cream fade so the photo merges into the copy — no hard edge */
  softMerge?: boolean
  children?: ReactNode
}

function LeafRule() {
  return (
    <div
      data-page-reveal=""
      className="mt-6 flex max-w-md items-center gap-3"
      aria-hidden
    >
      <span className="h-px flex-1 bg-soft-gold/55" />
      <svg viewBox="0 0 28 26" className="h-4 w-4 text-soft-gold" fill="none">
        <path
          d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
          fill="currentColor"
        />
        <path
          d="M7.2 8.5C5.4 12.2 4.6 15.2 5.2 17.6a3.4 3.4 0 0 0 6.1 1.4C10.2 16.4 9.2 12.8 7.2 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
        <path
          d="M20.8 8.5C22.6 12.2 23.4 15.2 22.8 17.6a3.4 3.4 0 0 1-6.1 1.4C17.8 16.4 18.8 12.8 20.8 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
      </svg>
      <span className="h-px flex-1 bg-soft-gold/55" />
    </div>
  )
}

export function EditorialHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  withLeafRule,
  softMerge,
  children,
}: EditorialHeroProps) {
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-page-reveal]'))
    if (image) maskRevealImages(scope.current)
  }, [])

  return (
    <section ref={scope} className="pt-28 md:pt-32">
      <div className="container-aura">
        {image ? (
          <div
            className={cn(
              'grid items-center',
              softMerge
                ? 'gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-0'
                : 'gap-12 lg:grid-cols-2 lg:gap-20',
            )}
          >
            <div className={cn(softMerge && 'relative z-10 lg:pr-6')}>
              <Eyebrow
                data-page-reveal=""
                tone={withLeafRule || softMerge ? 'gold' : 'olive'}
              >
                {eyebrow}
              </Eyebrow>
              <Display
                data-page-reveal=""
                as="h1"
                size="lg"
                className="mt-3 text-forest"
              >
                {title}
              </Display>
              {withLeafRule && <LeafRule />}
              {description && (
                <Body data-page-reveal="" muted className="mt-5 max-w-lg">
                  {description}
                </Body>
              )}
              {children && (
                <div data-page-reveal="" className="mt-8">
                  {children}
                </div>
              )}
            </div>

            <div
              data-reveal-image=""
              className={cn(
                'relative overflow-hidden',
                softMerge
                  ? 'aspect-[5/4] sm:aspect-[4/3] lg:-ml-20 lg:aspect-[5/4] xl:-ml-28'
                  : 'aspect-[4/3] bg-beige',
              )}
            >
              <img
                src={image}
                alt={imageAlt || title}
                className={cn(
                  'h-full w-full object-cover',
                  softMerge &&
                    '[mask-image:linear-gradient(to_bottom,transparent_0%,black_18%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_18%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_32%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_32%)]',
                )}
                loading="eager"
              />

              {softMerge && (
                <>
                  {/* Mobile: fade from top into cream */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#faf6ef] via-[#faf6ef]/55 to-transparent lg:hidden"
                  />
                  {/* Desktop: fade from left into cream */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-gradient-to-r from-[#faf6ef] from-15% via-[#faf6ef]/75 to-transparent lg:block"
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <Eyebrow data-page-reveal="">{eyebrow}</Eyebrow>
            <Display
              data-page-reveal=""
              as="h1"
              size="lg"
              className="mt-3 text-forest"
            >
              {title}
            </Display>
            {description && (
              <Body data-page-reveal="" muted className="mt-5 max-w-xl">
                {description}
              </Body>
            )}
            {children && (
              <div data-page-reveal="" className="mt-8">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

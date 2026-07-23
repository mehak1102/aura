import type { ReactNode } from 'react'
import { Body, Display, Eyebrow } from '@components/ui'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'

type EditorialHeroProps = {
  eyebrow: string
  title: string
  description?: string
  image?: string
  imageAlt?: string
  children?: ReactNode
}

export function EditorialHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
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
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
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
            <div data-reveal-image className="relative aspect-[4/3] bg-beige">
              <img
                src={image}
                alt={imageAlt || title}
                className="h-full w-full object-cover"
                loading="eager"
              />
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

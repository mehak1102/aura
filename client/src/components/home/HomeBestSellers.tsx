import { Link, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { bestSellers } from '@/data/home'
import { formatCurrency } from '@utils/index'
import { productImageUrl } from '@utils/productImage'
import { ROUTES } from '@/routes/paths'
import { useGsap, revealOnScroll, maskRevealImages } from '@animations/gsap'

export function HomeBestSellers() {
  const navigate = useNavigate()
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
    maskRevealImages(scope.current)
  }, [])

  return (
    <section ref={scope} className="section-aura">
      <div className="container-aura">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow data-reveal="">Best sellers</Eyebrow>
            <Display data-reveal="" as="h2" size="lg" className="mt-3 text-forest">
              Loved rituals
            </Display>
          </div>
          <div data-reveal="">
            <MagneticButton
              variant="outline"
              onClick={() => navigate(ROUTES.bestSellers)}
            >
              View all
            </MagneticButton>
          </div>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((product) => (
            <Link
              key={product.slug}
              to={`/product/${product.slug}`}
              className="group block"
            >
              <div
                data-reveal-image
                className="relative aspect-[4/5] overflow-hidden bg-beige"
              >
                <img
                  src={productImageUrl(product.image, 'card')}
                  alt={product.title}
                  className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={600}
                />
              </div>
              <div data-reveal="" className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-charcoal group-hover:text-forest">
                    {product.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm">{formatCurrency(product.price)}</span>
                    <span className="text-sm text-charcoal-muted line-through">
                      {formatCurrency(product.mrp)}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-micro text-olive">
                  {product.rating > 0 && (
                    <>
                      <Star className="h-3 w-3 fill-soft-gold text-soft-gold" />
                      {product.rating}
                    </>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Body data-reveal="" muted className="mt-10 text-center text-sm">
          Prices in INR · Small-batch availability may vary
        </Body>
      </div>
    </section>
  )
}

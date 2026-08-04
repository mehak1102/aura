import { Star } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { Body, Display, Eyebrow } from '@components/ui'
import { cn } from '@utils/index'

type ProductReviewsProps = {
  product: CatalogProduct
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const hasReviews = product.reviews.length > 0

  return (
    <section id="reviews" className="scroll-mt-28 py-8 md:py-10">
      <div className="container-aura">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Reviews</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              From the circle
            </Display>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-4xl text-forest">
              {product.ratingAverage}
            </span>
            <div>
              <div className="flex gap-0.5 text-soft-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < Math.round(product.ratingAverage) && 'fill-current',
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-charcoal-muted">
                {product.ratingCount} ratings
              </p>
            </div>
          </div>
        </div>

        {hasReviews ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {product.reviews.map((review) => (
              <article
                key={review.id}
                className="border border-charcoal/10 bg-warm-white/60 p-6"
              >
                <div className="flex gap-0.5 text-soft-gold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                {review.title && (
                  <h3 className="mt-4 font-display text-xl text-charcoal">
                    {review.title}
                  </h3>
                )}
                <Body muted className="mt-3">
                  “{review.comment}”
                </Body>
                <footer className="mt-6 flex items-center justify-between text-micro text-olive">
                  <span>
                    {review.userName}
                    {review.verified ? ' · Verified' : ''}
                  </span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-5 max-w-md text-sm font-light text-charcoal/60">
            Be the first to share how this ritual feels.
          </p>
        )}
      </div>
    </section>
  )
}

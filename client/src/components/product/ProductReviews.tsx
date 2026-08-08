import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import type { ProductReview } from '@/types'
import { Body, Display, Eyebrow } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { reviewsApi } from '@services/api/reviews'
import { summarizeReviews } from '@/data/productReviews'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

type ProductReviewsProps = {
  product: CatalogProduct
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Choose a rating').max(5),
  title: z.string().max(80).optional(),
  comment: z
    .string()
    .min(12, 'Share a little more about your experience')
    .max(800, 'Keep it under 800 characters'),
})

type ReviewFormInput = z.infer<typeof reviewSchema>

function onlyPublished(list: ProductReview[]) {
  return list.filter((r) => !r.status || r.status === 'published')
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const { isAuthenticated, user } = useAuth()
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    onlyPublished(product.reviews ?? []),
  )
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', comment: '' },
  })

  const rating = watch('rating')

  useEffect(() => {
    let cancelled = false
    setReviews(onlyPublished(product.reviews ?? []))
    setFormOpen(false)
    setFormError(null)
    setFormSuccess(null)
    setLoading(true)
    reset({ rating: 0, title: '', comment: '' })

    ;(async () => {
      try {
        const remote = await reviewsApi.list(product.id)
        if (cancelled) return
        setReviews(onlyPublished(remote))
      } catch {
        if (!cancelled) setReviews(onlyPublished(product.reviews ?? []))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [product.id, product.reviews, reset])

  const summary = useMemo(() => {
    const live = summarizeReviews(reviews)
    if (live.count > 0) return live
    return {
      average: product.ratingAverage,
      count: product.ratingCount,
    }
  }, [reviews, product.ratingAverage, product.ratingCount])

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    setFormSuccess(null)
    try {
      await reviewsApi.create(product.id, {
        rating: values.rating,
        title: values.title?.trim() || undefined,
        comment: values.comment.trim(),
      })
      reset({ rating: 0, title: '', comment: '' })
      setFormOpen(false)
      setFormSuccess(
        'Thank you — your review was submitted and will appear after admin approval.',
      )
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (status === 401
          ? 'Please sign in to leave a review.'
          : 'Could not save your review. Please try again.')
      setFormError(msg)
    }
  })

  return (
    <section id="reviews" className="scroll-mt-28 py-8 md:py-10">
      <div className="container-aura">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Reviews</Eyebrow>
            <Display as="h2" size="md" className="mt-3 text-forest">
              From the circle
            </Display>
            <Body muted className="mt-2 max-w-md">
              Real notes from people who use {product.title} in their ritual.
            </Body>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl text-forest">
                {summary.count > 0 ? summary.average.toFixed(1) : '—'}
              </span>
              <div>
                <div className="flex gap-0.5 text-soft-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < Math.round(summary.average) && 'fill-current',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-charcoal-muted">
                  {summary.count}{' '}
                  {summary.count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setFormOpen((open) => !open)
                  setFormError(null)
                  setFormSuccess(null)
                }}
                className="inline-flex h-11 items-center rounded-full bg-forest px-6 text-[0.65rem] font-medium tracking-[0.2em] text-warm-white uppercase transition-colors hover:bg-forest-deep"
              >
                {formOpen ? 'Cancel' : 'Write a review'}
              </button>
            ) : (
              <Link
                to={ROUTES.login}
                className="inline-flex h-11 items-center rounded-full border border-[#c4a35a]/65 px-6 text-[0.65rem] font-medium tracking-[0.2em] text-forest uppercase transition-colors hover:border-[#b8975c] hover:bg-white"
              >
                Sign in to review
              </Link>
            )}
          </div>
        </div>

        {formSuccess && (
          <p className="mt-6 rounded-xl border border-[#c4a35a]/40 bg-white/60 px-4 py-3 text-sm text-forest">
            {formSuccess}
          </p>
        )}

        {formOpen && isAuthenticated && (
          <form
            onSubmit={onSubmit}
            className="mt-8 max-w-xl space-y-5 rounded-2xl border border-[#e7e0d1] bg-white/80 p-6"
            noValidate
          >
            <p className="text-[0.7rem] tracking-[0.2em] text-[#b8975c] uppercase">
              Reviewing as {user?.name?.split(' ')[0] || 'you'}
            </p>
            <p className="text-[0.8rem] font-light text-charcoal/55">
              Reviews are checked by our team before they appear on this page.
            </p>

            <div>
              <p className="text-[0.7rem] tracking-[0.18em] text-charcoal/50 uppercase">
                Rating
              </p>
              <div
                className="mt-2 flex gap-1.5"
                role="radiogroup"
                aria-label="Star rating"
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1
                  const active = value <= (hoverRating || rating)
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value === 1 ? '' : 's'}`}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setValue('rating', value, { shouldValidate: true })
                      }
                      className="rounded-full p-0.5 text-soft-gold transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'h-7 w-7',
                          active ? 'fill-current' : 'opacity-35',
                        )}
                        strokeWidth={1.5}
                      />
                    </button>
                  )
                })}
              </div>
              {errors.rating && (
                <p className="mt-1.5 text-[0.75rem] text-[#a8543f]">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <label className="block">
              <span className="text-[0.7rem] tracking-[0.18em] text-charcoal/50 uppercase">
                Title{' '}
                <span className="normal-case tracking-normal">(optional)</span>
              </span>
              <input
                className="mt-2 w-full border-b border-[#e7e0d1] bg-transparent py-2 text-[0.95rem] text-forest outline-none placeholder:text-charcoal/30 focus:border-[#b8975c]"
                placeholder="A short headline"
                {...register('title')}
              />
            </label>

            <label className="block">
              <span className="text-[0.7rem] tracking-[0.18em] text-charcoal/50 uppercase">
                Your review
              </span>
              <textarea
                rows={4}
                className="mt-2 w-full resize-y border border-[#e7e0d1] bg-[#faf8f4]/80 px-3.5 py-3 text-[0.95rem] text-forest outline-none placeholder:text-charcoal/30 focus:border-[#b8975c]"
                placeholder="How does this ritual feel on your skin or hair?"
                {...register('comment')}
              />
              {errors.comment && (
                <p className="mt-1.5 text-[0.75rem] text-[#a8543f]">
                  {errors.comment.message}
                </p>
              )}
            </label>

            {formError && (
              <p className="rounded-lg border border-[#a8543f]/30 bg-[#a8543f]/5 px-3.5 py-2.5 text-[0.8rem] text-[#a8543f]">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center rounded-full bg-forest px-7 text-[0.65rem] font-medium tracking-[0.2em] text-warm-white uppercase transition-colors hover:bg-forest-deep disabled:opacity-50"
            >
              {isSubmitting ? 'Sending…' : 'Submit for approval'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="mt-8 text-sm font-light text-charcoal/50">
            Loading reviews…
          </p>
        ) : reviews.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-[#e7e0d1] bg-white/75 p-6"
              >
                <div
                  className="flex gap-0.5 text-soft-gold"
                  aria-label={`${review.rating} out of 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < review.rating && 'fill-current',
                      )}
                    />
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
          <p className="mt-8 max-w-md text-sm font-light text-charcoal/60">
            Be the first to share how this ritual feels.
          </p>
        )}
      </div>
    </section>
  )
}

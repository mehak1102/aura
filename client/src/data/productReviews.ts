import type { ProductReview } from '@/types'

export function summarizeReviews(reviews: ProductReview[]) {
  if (!reviews.length) {
    return { average: 0, count: 0 }
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  }
}

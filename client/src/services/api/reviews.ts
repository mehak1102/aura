import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse, ProductReview } from '@/types'

type ReviewsResponse = ApiResponse<{ reviews: ProductReview[] }>
type CreateReviewResponse = ApiResponse<{ review: ProductReview }>

export type CreateReviewInput = {
  rating: number
  title?: string
  comment: string
}

export const reviewsApi = {
  async list(productId: string) {
    const { data } = await api.get<ReviewsResponse>(
      API_ENDPOINTS.reviews.list(productId),
    )
    return data.data.reviews
  },

  async create(productId: string, input: CreateReviewInput) {
    const { data } = await api.post<CreateReviewResponse>(
      API_ENDPOINTS.reviews.create(productId),
      input,
    )
    return data.data.review
  },
}

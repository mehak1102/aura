import { isAxiosError } from 'axios'
import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'

export type AppliedPromo = {
  code: string
  description?: string
  discount: number
  total: number
}

export const couponsApi = {
  async validate(code: string, subtotal: number) {
    const { data } = await api.post<ApiResponse<AppliedPromo>>(
      API_ENDPOINTS.coupons.validate,
      { code, subtotal },
    )
    return data.data
  },
}

/** Server sends a human-readable reason (min order, expired, unknown code). */
export function promoErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message
    if (message) return message
    if (!error.response) return 'Could not reach the server. Try again.'
  }
  return 'Invalid or expired code'
}

import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'

export type PublicSettings = {
  storeName: string
  supportEmail: string
  contactPhone: string
  freeShippingThreshold: number
  currency: string
}

export const settingsApi = {
  async public() {
    const { data } = await api.get<ApiResponse<PublicSettings>>(
      API_ENDPOINTS.settings.public,
    )
    return data.data
  },
}

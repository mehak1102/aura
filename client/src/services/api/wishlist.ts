import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { CatalogProduct } from '@/types/shop'

export const wishlistApi = {
  async get() {
    const { data } = await api.get<
      ApiResponse<{ ids: string[]; products: CatalogProduct[]; count: number }>
    >(API_ENDPOINTS.wishlist.get)
    return data.data
  },

  async toggle(productId: string) {
    const { data } = await api.post<
      ApiResponse<{
        ids: string[]
        products: CatalogProduct[]
        count: number
        added: boolean
      }>
    >(API_ENDPOINTS.wishlist.toggle, { productId })
    return data.data
  },
}

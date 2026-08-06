import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { CatalogProduct as ShopProduct } from '@/types/shop'
import { enrichProduct } from '@utils/product'

type ProductListResponse = ApiResponse<{
  products: ShopProduct[]
  total: number
}>

type ProductDetailResponse = ApiResponse<{ product: ShopProduct }>

export const productsApi = {
  async list(params?: Record<string, string | number | boolean | undefined>) {
    const { data } = await api.get<ProductListResponse>(
      API_ENDPOINTS.products.list,
      { params },
    )
    return data.data.products.map((p) => enrichProduct(p))
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<ProductDetailResponse>(
      API_ENDPOINTS.products.detail(slug),
    )
    return enrichProduct(data.data.product)
  },

  async search(query: string) {
    const { data } = await api.get<ProductListResponse>(
      API_ENDPOINTS.products.search,
      { params: { q: query } },
    )
    return data.data.products.map((p) => enrichProduct(p))
  },
}

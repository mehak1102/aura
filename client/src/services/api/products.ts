import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { CatalogProduct as ShopProduct } from '@/types/shop'
import { PRODUCTS } from '@/data/products'
import { enrichProduct } from '@utils/product'

type ProductListResponse = ApiResponse<{
  products: ShopProduct[]
  total: number
}>

type ProductDetailResponse = ApiResponse<{ product: ShopProduct }>

export const productsApi = {
  async list(params?: Record<string, string | number | boolean | undefined>) {
    try {
      const { data } = await api.get<ProductListResponse>(
        API_ENDPOINTS.products.list,
        { params },
      )
      return data.data.products.map((p) => enrichProduct(p))
    } catch {
      return PRODUCTS.map((p) => enrichProduct(p))
    }
  },

  async getBySlug(slug: string) {
    try {
      const { data } = await api.get<ProductDetailResponse>(
        API_ENDPOINTS.products.detail(slug),
      )
      return enrichProduct(data.data.product)
    } catch {
      const local = PRODUCTS.find((p) => p.slug === slug)
      return local ? enrichProduct(local) : null
    }
  },

  async search(query: string) {
    try {
      const { data } = await api.get<ProductListResponse>(
        API_ENDPOINTS.products.search,
        { params: { q: query } },
      )
      return data.data.products.map((p) => enrichProduct(p))
    } catch {
      const q = query.toLowerCase()
      return PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      ).map((p) => enrichProduct(p))
    }
  },
}

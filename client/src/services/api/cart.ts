import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { StoredCartLine } from '@utils/cart'

type CartPayload = {
  items: StoredCartLine[]
  count: number
  subtotal: number
}

/** Server carts keep a mongo _id per line, which the client does not track */
function toStoredLines(items: (StoredCartLine & { _id?: string })[]) {
  return items.map(({ productId, variantId, quantity }) => ({
    productId,
    variantId,
    quantity,
  }))
}

export const cartApi = {
  async get() {
    const { data } = await api.get<ApiResponse<CartPayload>>(
      API_ENDPOINTS.cart.get,
    )
    return toStoredLines(data.data.items)
  },

  async replace(items: StoredCartLine[]) {
    const { data } = await api.put<ApiResponse<CartPayload>>(
      API_ENDPOINTS.cart.replace,
      { items },
    )
    return toStoredLines(data.data.items)
  },
}

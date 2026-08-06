import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { Order } from '@utils/orders'
import type { PendingCheckout } from '@utils/orders'

const CHECKOUT_TOKEN_KEY = 'aura_checkout_token'

export function getCheckoutToken() {
  return sessionStorage.getItem(CHECKOUT_TOKEN_KEY)
}

export function setCheckoutToken(token: string | null) {
  if (token) sessionStorage.setItem(CHECKOUT_TOKEN_KEY, token)
  else sessionStorage.removeItem(CHECKOUT_TOKEN_KEY)
}

export const ordersApi = {
  async list() {
    const { data } = await api.get<ApiResponse<{ orders: Order[] }>>(
      API_ENDPOINTS.orders.list,
    )
    return data.data.orders
  },

  async get(id: string, opts?: { checkoutToken?: string }) {
    const { data } = await api.get<ApiResponse<{ order: Order }>>(
      API_ENDPOINTS.orders.detail(id),
      {
        headers: opts?.checkoutToken
          ? { 'X-Checkout-Token': opts.checkoutToken }
          : undefined,
      },
    )
    return data.data.order
  },

  async create(payload: {
    shipping: PendingCheckout['shipping']
    items: PendingCheckout['items']
    giftWrap?: boolean
    couponCode?: string
    paymentMethod: 'razorpay' | 'cod'
  }) {
    const { data } = await api.post<
      ApiResponse<{ order: Order; checkoutToken?: string }>
    >(API_ENDPOINTS.orders.create, payload)
    if (data.data.checkoutToken) {
      setCheckoutToken(data.data.checkoutToken)
    }
    return data.data.order
  },
}

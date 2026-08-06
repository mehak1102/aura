import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import type { Order } from '@utils/orders'
import type { PendingCheckout } from '@utils/orders'

export const ordersApi = {
  async list() {
    const { data } = await api.get<ApiResponse<{ orders: Order[] }>>(
      API_ENDPOINTS.orders.list,
    )
    return data.data.orders
  },

  async get(id: string, email?: string) {
    const { data } = await api.get<ApiResponse<{ order: Order }>>(
      API_ENDPOINTS.orders.detail(id),
      { params: email ? { email } : undefined },
    )
    return data.data.order
  },

  async create(payload: {
    id?: string
    shipping: PendingCheckout['shipping']
    items: PendingCheckout['items']
    giftWrap?: boolean
    couponCode?: string
    paymentMethod: 'razorpay' | 'cod'
    status?: Order['status']
    paymentId?: string
    razorpayOrderId?: string
    /** @deprecated server recalculates — kept for backwards compat */
    subtotal?: number
    mrpTotal?: number
    savings?: number
    shippingFee?: number
    giftWrapFee?: number
    total?: number
  }) {
    const { data } = await api.post<ApiResponse<{ order: Order }>>(
      API_ENDPOINTS.orders.create,
      payload,
    )
    return data.data.order
  },
}

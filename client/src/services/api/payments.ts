import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types'
import { getCheckoutToken } from './orders'

export const paymentsApi = {
  async createOrder(payload: { orderNumber: string; receipt?: string }) {
    const checkoutToken = getCheckoutToken()
    const { data } = await api.post<
      ApiResponse<{
        mode: 'demo' | 'live'
        orderId: string
        amount: number
        currency: string
        keyId?: string
      }>
    >(API_ENDPOINTS.payments.createOrder, {
      orderNumber: payload.orderNumber,
      receipt: payload.receipt,
      ...(checkoutToken ? { checkoutToken } : {}),
    })
    return data.data
  },

  async verify(payload: {
    razorpay_order_id?: string
    razorpay_payment_id: string
    razorpay_signature?: string
    orderNumber: string
  }) {
    const checkoutToken = getCheckoutToken()
    const { data } = await api.post<
      ApiResponse<{
        verified: boolean
        mode: 'demo' | 'live'
        paymentId: string
        orderId?: string
      }>
    >(API_ENDPOINTS.payments.verify, {
      ...payload,
      ...(checkoutToken ? { checkoutToken } : {}),
    })
    return data.data
  },
}

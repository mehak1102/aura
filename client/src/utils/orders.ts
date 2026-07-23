import type { CheckoutInput, ShippingMethod } from '@/lib/checkoutSchemas'
import { SHIPPING_OPTIONS } from '@/lib/checkoutSchemas'
import type { CartLine, StoredCartLine } from '@utils/cart'

export type PaymentMethod = 'razorpay' | 'cod'

export type OrderLine = {
  productId: string
  variantId: string
  title: string
  slug: string
  variantName: string
  image?: string
  quantity: number
  unitPrice: number
  mrp: number
  lineTotal: number
}

export type Order = {
  id: string
  createdAt: string
  status: 'pending' | 'paid' | 'cod_placed' | 'failed'
  paymentMethod: PaymentMethod
  paymentId?: string
  shipping: CheckoutInput
  shippingFee: number
  subtotal: number
  mrpTotal: number
  savings: number
  total: number
  items: OrderLine[]
}

export type PendingCheckout = {
  shipping: CheckoutInput
  items: StoredCartLine[]
  subtotal: number
  mrpTotal: number
  savings: number
  shippingFee: number
  total: number
}

const PENDING_KEY = 'aura_checkout_pending'
const ORDERS_KEY = 'aura_orders'
const LAST_ORDER_KEY = 'aura_last_order_id'

export function getShippingFee(method: ShippingMethod) {
  return SHIPPING_OPTIONS.find((o) => o.id === method)?.price ?? 0
}

export function buildOrderLines(lines: CartLine[]): OrderLine[] {
  return lines.map((l) => ({
    productId: l.productId,
    variantId: l.variantId,
    title: l.product.title,
    slug: l.product.slug,
    variantName: l.variant.name,
    image: l.product.images[0]?.url,
    quantity: l.quantity,
    unitPrice: l.variant.price,
    mrp: l.variant.mrp,
    lineTotal: l.lineTotal,
  }))
}

export function savePendingCheckout(data: PendingCheckout) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(data))
}

export function loadPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as PendingCheckout) : null
  } catch {
    return null
  }
}

export function clearPendingCheckout() {
  sessionStorage.removeItem(PENDING_KEY)
}

export function createOrderId() {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AON-${stamp}-${rand}`
}

export function saveOrder(order: Order) {
  const orders = loadOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 50)))
  localStorage.setItem(LAST_ORDER_KEY, order.id)
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function getOrderById(id: string) {
  return loadOrders().find((o) => o.id === id)
}

export function getLastOrderId() {
  return localStorage.getItem(LAST_ORDER_KEY)
}

import crypto from 'node:crypto'
import catalog from '../data/catalog.json' with { type: 'json' }

const carts = new Map()
const orders = new Map()
const wishlists = new Map()

function userKey(userId) {
  return String(userId)
}

function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AON-${stamp}-${rand}`
}

function hydrateLine(item) {
  const product = catalog.find((p) => p.id === item.productId)
  if (!product) return null
  const variant =
    product.variants.find((v) => v.id === item.variantId) ||
    product.variants[0]
  if (!variant) return null
  return {
    productId: item.productId,
    variantId: variant.id,
    title: product.title,
    slug: product.slug,
    variantName: variant.name,
    image: product.images?.[0]?.url,
    quantity: item.quantity,
    unitPrice: variant.price,
    mrp: variant.mrp,
    lineTotal: variant.price * item.quantity,
  }
}

export const memoryStore = {
  // Cart
  getCart(userId) {
    return carts.get(userKey(userId)) || []
  },

  setCart(userId, items) {
    carts.set(userKey(userId), items)
    return items
  },

  // Wishlist
  getWishlist(userId) {
    return wishlists.get(userKey(userId)) || []
  },

  setWishlist(userId, ids) {
    wishlists.set(userKey(userId), ids)
    return ids
  },

  toggleWishlist(userId, productId) {
    const key = userKey(userId)
    const current = wishlists.get(key) || []
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    wishlists.set(key, next)
    return next
  },

  // Orders
  listOrders(userId) {
    return [...orders.values()]
      .filter((o) => o.userId === userKey(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  listAllOrders() {
    return [...orders.values()].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
  },

  getOrder(userId, orderId) {
    const order = orders.get(orderId)
    if (!order || order.userId !== userKey(userId)) return null
    return order
  },

  createOrder(userId, payload) {
    const orderNumber = payload.id || makeOrderNumber()
    const order = {
      id: orderNumber,
      userId: userKey(userId),
      createdAt: new Date().toISOString(),
      status: payload.status || 'pending',
      paymentMethod: payload.paymentMethod,
      paymentId: payload.paymentId,
      razorpayOrderId: payload.razorpayOrderId,
      shipping: payload.shipping,
      shippingFee: payload.shippingFee,
      giftWrapFee: payload.giftWrapFee ?? 0,
      subtotal: payload.subtotal,
      mrpTotal: payload.mrpTotal,
      savings: payload.savings,
      total: payload.total,
      items: payload.items,
    }
    orders.set(orderNumber, order)
    return order
  },

  updateOrder(orderId, patch) {
    const order = orders.get(orderId)
    if (!order) return null
    const next = { ...order, ...patch }
    orders.set(orderId, next)
    return next
  },

  hydrateCartItems(items) {
    return items
      .map((item) => {
        const product = catalog.find((p) => p.id === item.productId)
        if (!product) return null
        const variant =
          product.variants.find((v) => v.id === item.variantId) ||
          product.variants[0]
        if (!variant) return null
        return {
          ...item,
          product,
          variant,
          lineTotal: variant.price * item.quantity,
        }
      })
      .filter(Boolean)
  },

  buildOrderLines(items) {
    return items.map(hydrateLine).filter(Boolean)
  },
}

export function createOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `AON-${stamp}-${rand}`
}

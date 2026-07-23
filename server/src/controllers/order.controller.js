import { Order } from '../models/Order.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore, createOrderNumber } from '../services/memoryStore.js'
import { productCatalog } from '../services/productCatalog.js'

function getUserId(req) {
  return req.user.id || req.user._id?.toString()
}

async function buildLinesFromPayload(items) {
  const lines = []
  for (const item of items) {
    const product = await productCatalog.getByLegacyId(item.productId)
    if (!product) continue
    const variant =
      product.variants.find((v) => v.id === item.variantId) ||
      product.variants[0]
    if (!variant) continue
    const qty = item.quantity || 1
    lines.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      slug: product.slug,
      variantName: variant.name,
      image: product.images?.[0]?.url,
      quantity: qty,
      unitPrice: variant.price,
      mrp: variant.mrp,
      lineTotal: variant.price * qty,
    })
  }
  return lines
}

export const listOrders = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    res.json({ success: true, data: { orders: memoryStore.listOrders(userId) } })
    return
  }

  const docs = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(50)
  res.json({
    success: true,
    data: { orders: docs.map((d) => d.toClientJSON()) },
  })
})

export const getOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const order = memoryStore.getOrder(userId, req.params.id)
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: { order } })
    return
  }

  const doc = await Order.findOne({ orderNumber: req.params.id, user: userId })
  if (!doc) throw new AppError('Order not found', 404)
  res.json({ success: true, data: { order: doc.toClientJSON() } })
})

export const createOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const {
    shipping,
    items,
    subtotal,
    mrpTotal,
    savings,
    shippingFee,
    total,
    paymentMethod,
    status,
    paymentId,
    razorpayOrderId,
    id,
  } = req.body

  if (!shipping || !items?.length) {
    throw new AppError('Shipping details and items are required')
  }

  const orderLines = await buildLinesFromPayload(items)
  if (!orderLines.length) throw new AppError('No valid items in order')

  const orderNumber = id || createOrderNumber()
  const payload = {
    orderNumber,
    user: userId,
    status: status || (paymentMethod === 'cod' ? 'cod_placed' : 'pending'),
    paymentMethod,
    paymentId,
    razorpayOrderId,
    shipping,
    shippingFee: shippingFee ?? 0,
    subtotal: subtotal ?? orderLines.reduce((s, l) => s + l.lineTotal, 0),
    mrpTotal: mrpTotal ?? orderLines.reduce((s, l) => s + l.mrp * l.quantity, 0),
    savings: savings ?? 0,
    total: total ?? 0,
    items: orderLines,
  }

  if (useMemory()) {
    const order = memoryStore.createOrder(userId, {
      id: orderNumber,
      ...payload,
      items: orderLines,
    })
    res.status(201).json({ success: true, data: { order } })
    return
  }

  const doc = await Order.create(payload)
  res.status(201).json({ success: true, data: { order: doc.toClientJSON() } })
})

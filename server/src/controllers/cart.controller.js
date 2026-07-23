import { Cart } from '../models/Cart.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore } from '../services/memoryStore.js'
import { productCatalog } from '../services/productCatalog.js'

function getUserId(req) {
  return req.user.id || req.user._id?.toString()
}

async function hydrateItems(items) {
  const hydrated = []
  for (const item of items) {
    const product = await productCatalog.getByLegacyId(item.productId)
    if (!product) continue
    const variant =
      product.variants.find((v) => v.id === item.variantId) ||
      product.variants[0]
    if (!variant) continue
    hydrated.push({
      id: item._id?.toString?.() || item.id,
      productId: item.productId,
      variantId: variant.id,
      quantity: item.quantity,
      product,
      variant,
      lineTotal: variant.price * item.quantity,
    })
  }
  return hydrated
}

export const getCart = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const items = memoryStore.getCart(userId)
    const lines = memoryStore.hydrateCartItems(items)
    res.json({
      success: true,
      data: {
        items,
        lines,
        count: items.reduce((s, i) => s + i.quantity, 0),
        subtotal: lines.reduce((s, l) => s + l.lineTotal, 0),
      },
    })
    return
  }

  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  const lines = await hydrateItems(cart.items)
  res.json({
    success: true,
    data: {
      items: cart.items,
      lines,
      count: cart.items.reduce((s, i) => s + i.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.lineTotal, 0),
    },
  })
})

export const addCartItem = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const { productId, variantId, quantity = 1 } = req.body
  if (!productId || !variantId) {
    throw new AppError('productId and variantId are required')
  }

  if (useMemory()) {
    const items = memoryStore.getCart(userId)
    const idx = items.findIndex(
      (i) => i.productId === productId && i.variantId === variantId,
    )
    if (idx >= 0) items[idx].quantity += quantity
    else items.push({ productId, variantId, quantity })
    memoryStore.setCart(userId, items)
    const lines = memoryStore.hydrateCartItems(items)
    res.json({
      success: true,
      data: { items, lines, count: items.reduce((s, i) => s + i.quantity, 0) },
    })
    return
  }

  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })

  const existing = cart.items.find(
    (i) => i.productId === productId && i.variantId === variantId,
  )
  if (existing) existing.quantity += quantity
  else cart.items.push({ productId, variantId, quantity })
  await cart.save()

  const lines = await hydrateItems(cart.items)
  res.json({
    success: true,
    data: { items: cart.items, lines, count: cart.items.reduce((s, i) => s + i.quantity, 0) },
  })
})

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const { quantity } = req.body
  if (!quantity || quantity < 1) throw new AppError('Quantity must be at least 1')

  if (useMemory()) {
    const items = memoryStore.getCart(userId)
    const item = items.find((i) => i._id === req.params.id || `${i.productId}-${i.variantId}` === req.params.id)
    if (!item) throw new AppError('Cart item not found', 404)
    item.quantity = quantity
    memoryStore.setCart(userId, items)
    res.json({ success: true, data: { items } })
    return
  }

  const cart = await Cart.findOne({ user: userId })
  if (!cart) throw new AppError('Cart not found', 404)
  const item = cart.items.id(req.params.id)
  if (!item) throw new AppError('Cart item not found', 404)
  item.quantity = quantity
  await cart.save()
  res.json({ success: true, data: { items: cart.items } })
})

export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    let items = memoryStore.getCart(userId)
    items = items.filter(
      (i) => `${i.productId}-${i.variantId}` !== req.params.id && i._id !== req.params.id,
    )
    memoryStore.setCart(userId, items)
    res.json({ success: true, data: { items } })
    return
  }

  const cart = await Cart.findOne({ user: userId })
  if (!cart) throw new AppError('Cart not found', 404)
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.id)
  await cart.save()
  res.json({ success: true, data: { items: cart.items } })
})

import { User } from '../models/User.model.js'
import { Product } from '../models/Product.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore } from '../services/memoryStore.js'
import { productCatalog } from '../services/productCatalog.js'

function getUserId(req) {
  return req.user.id || req.user._id?.toString()
}

async function resolveProducts(ids) {
  const products = []
  for (const id of ids) {
    const product = await productCatalog.getByLegacyId(id)
    if (product) products.push(product)
  }
  return products
}

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const ids = memoryStore.getWishlist(userId)
    const products = await resolveProducts(ids)
    res.json({ success: true, data: { ids, products, count: ids.length } })
    return
  }

  const user = await User.findById(userId).populate('wishlist')
  const ids = (user?.wishlist || []).map((p) =>
    p.legacyId || p._id?.toString(),
  )
  const products = await resolveProducts(ids)
  res.json({ success: true, data: { ids, products, count: ids.length } })
})

export const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const { productId } = req.body
  if (!productId) throw new AppError('productId is required')

  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  if (useMemory()) {
    const ids = memoryStore.toggleWishlist(userId, productId)
    const products = await resolveProducts(ids)
    const added = ids.includes(productId)
    res.json({
      success: true,
      data: { ids, products, count: ids.length, added },
    })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)

  const dbProduct = await Product.findOne({ legacyId: productId })
  if (!dbProduct) {
    throw new AppError('Product not available in database. Run npm run seed.', 503)
  }

  const mongoId = dbProduct._id
  const idx = user.wishlist.findIndex((id) => id.toString() === mongoId.toString())
  let added = false
  if (idx >= 0) user.wishlist.splice(idx, 1)
  else {
    user.wishlist.push(mongoId)
    added = true
  }
  await user.save()

  const populated = await User.findById(userId).populate('wishlist')
  const ids = populated.wishlist.map((p) => p.legacyId || p._id.toString())
  const products = await resolveProducts(ids)
  res.json({
    success: true,
    data: { ids, products, count: ids.length, added },
  })
})

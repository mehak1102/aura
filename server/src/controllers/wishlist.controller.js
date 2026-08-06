import mongoose from 'mongoose'
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

/** Resolve client product ids (legacy or ObjectId) to Mongo docs. */
async function findProductsByClientIds(ids) {
  const unique = [...new Set(ids.map(String))]
  if (!unique.length) return []

  const objectIds = unique.filter((id) => mongoose.isValidObjectId(id))
  const docs = await Product.find({
    $or: [
      { legacyId: { $in: unique } },
      ...(objectIds.length ? [{ _id: { $in: objectIds } }] : []),
    ],
  }).select('_id legacyId')

  return docs
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
  const ids = (user?.wishlist || [])
    .map((p) => p.legacyId || p._id?.toString())
    .filter(Boolean)
  const products = await resolveProducts(ids)
  res.json({ success: true, data: { ids, products, count: ids.length } })
})

/** Overwrites the saved wishlist — used to merge a guest list after login */
export const replaceWishlist = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const { ids } = req.body
  if (!Array.isArray(ids)) throw new AppError('ids must be an array')

  const unique = [...new Set(ids.map(String))]

  if (useMemory()) {
    memoryStore.setWishlist(userId, unique)
    const products = await resolveProducts(unique)
    res.json({
      success: true,
      data: { ids: unique, products, count: unique.length },
    })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)

  const docs = await findProductsByClientIds(unique)
  const keptLegacy = docs.map((d) => d.legacyId || d._id.toString())
  user.wishlist = docs.map((d) => d._id)
  await user.save()

  const products = await resolveProducts(keptLegacy)
  res.json({
    success: true,
    data: { ids: keptLegacy, products, count: keptLegacy.length },
  })
})

export const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const { productId } = req.body
  if (!productId) throw new AppError('productId is required')

  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  const stableId = product.id

  if (useMemory()) {
    const ids = memoryStore.toggleWishlist(userId, stableId)
    const products = await resolveProducts(ids)
    const added = ids.includes(stableId)
    res.json({
      success: true,
      data: { ids, products, count: ids.length, added },
    })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)

  const or = [{ legacyId: productId }]
  if (mongoose.isValidObjectId(productId)) or.push({ _id: productId })
  const dbProduct = await Product.findOne({ $or: or })
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

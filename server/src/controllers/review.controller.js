import crypto from 'node:crypto'
import { Review } from '../models/Review.model.js'
import { Product } from '../models/Product.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { productCatalog } from '../services/productCatalog.js'

const memoryReviews = new Map()

function reviewKey(productId) {
  return String(productId)
}

export const listReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  if (useMemory()) {
    const reviews = memoryReviews.get(reviewKey(productId)) || product.reviews || []
    res.json({ success: true, data: { reviews } })
    return
  }

  const docs = await Review.find({
    $or: [{ productLegacyId: productId }, { product: product._id }],
  })
    .sort({ createdAt: -1 })
    .limit(50)

  res.json({
    success: true,
    data: { reviews: docs.map((d) => d.toClientJSON()) },
  })
})

export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { rating, title, comment } = req.body
  if (!rating || !comment?.trim()) {
    throw new AppError('Rating and comment are required')
  }

  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  const review = {
    id: crypto.randomUUID(),
    userName: req.user.name,
    rating: Number(rating),
    title: title?.trim(),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    verified: true,
  }

  if (useMemory()) {
    const key = reviewKey(productId)
    const list = memoryReviews.get(key) || []
    list.unshift(review)
    memoryReviews.set(key, list)
    res.status(201).json({ success: true, data: { review } })
    return
  }

  const doc = await Review.create({
    productLegacyId: productId,
    product: product._id,
    user: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    title: title?.trim(),
    comment: comment.trim(),
    verified: true,
  })

  const count = await Review.countDocuments({ productLegacyId: productId })
  const avg = await Review.aggregate([
    { $match: { productLegacyId: productId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ])
  await Product.findOneAndUpdate(
    { legacyId: productId },
    {
      ratingCount: count,
      ratingAverage: Math.round((avg[0]?.avg || rating) * 10) / 10,
    },
  )

  res.status(201).json({ success: true, data: { review: doc.toClientJSON() } })
})

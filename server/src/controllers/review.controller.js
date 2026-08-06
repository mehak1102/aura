import { Review } from '../models/Review.model.js'
import { Product } from '../models/Product.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { productCatalog } from '../services/productCatalog.js'
import {
  createMemoryReview,
  publishedMemoryReviews,
} from '../services/reviewStore.js'

async function refreshProductRating(productId) {
  const docs = await Review.find({
    productLegacyId: productId,
    status: 'published',
  })
  const count = docs.length
  const avg =
    count === 0
      ? 0
      : Math.round(
          (docs.reduce((sum, d) => sum + d.rating, 0) / count) * 10,
        ) / 10
  await Product.findOneAndUpdate(
    { legacyId: productId },
    { ratingCount: count, ratingAverage: avg },
  )
}

/** Public product page — only approved reviews. */
export const listReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  if (useMemory()) {
    res.json({
      success: true,
      data: { reviews: publishedMemoryReviews(productId) },
    })
    return
  }

  const docs = await Review.find({
    status: 'published',
    $or: [{ productLegacyId: productId }, { product: product._id }],
  })
    .sort({ createdAt: -1 })
    .limit(50)

  res.json({
    success: true,
    data: { reviews: docs.map((d) => d.toClientJSON()) },
  })
})

/** Customers submit for moderation — never published immediately. */
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { rating, title, comment } = req.body
  if (!rating || !comment?.trim()) {
    throw new AppError('Rating and comment are required')
  }

  const product = await productCatalog.getByLegacyId(productId)
  if (!product) throw new AppError('Product not found', 404)

  if (useMemory()) {
    const review = createMemoryReview({
      productId,
      userName: req.user.name,
      rating,
      title,
      comment,
    })
    res.status(201).json({
      success: true,
      message: 'Review submitted for admin approval.',
      data: { review },
    })
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
    verified: false,
    status: 'pending',
  })

  res.status(201).json({
    success: true,
    message: 'Review submitted for admin approval.',
    data: { review: doc.toClientJSON() },
  })
})

export { refreshProductRating }

import { Router } from 'express'
import {
  listProducts,
  getProductBySlug,
  searchProducts,
  getProductFilters,
} from '../controllers/product.controller.js'
import {
  listReviews,
  createReview,
} from '../controllers/review.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/search', searchProducts)
router.get('/filters', getProductFilters)
router.get('/', listProducts)
router.get('/:productId/reviews', listReviews)
router.post('/:productId/reviews', protect, createReview)
router.get('/:slug', getProductBySlug)

export default router

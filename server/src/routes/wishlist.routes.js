import { Router } from 'express'
import {
  getWishlist,
  replaceWishlist,
  toggleWishlist,
} from '../controllers/wishlist.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/', getWishlist)
router.put('/', replaceWishlist)
router.post('/toggle', toggleWishlist)

export default router

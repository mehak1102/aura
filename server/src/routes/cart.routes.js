import { Router } from 'express'
import {
  getCart,
  replaceCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '../controllers/cart.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/', getCart)
router.put('/', replaceCart)
router.post('/items', addCartItem)
router.patch('/items/:id', updateCartItem)
router.delete('/items/:id', removeCartItem)

export default router

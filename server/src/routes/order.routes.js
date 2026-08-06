import { Router } from 'express'
import {
  listOrders,
  getOrder,
  createOrder,
} from '../controllers/order.controller.js'
import { protect, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', optionalAuth, createOrder)
router.get('/', protect, listOrders)
router.get('/:id', optionalAuth, getOrder)

export default router

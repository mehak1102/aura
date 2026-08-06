import { Router } from 'express'
import {
  listOrders,
  getOrder,
  createOrder,
  guestOrderLookupLimiter,
} from '../controllers/order.controller.js'
import { protect, optionalAuth } from '../middleware/auth.js'
import { validateBody, createOrderSchema } from '../validation/schemas.js'

const router = Router()

router.post('/', optionalAuth, validateBody(createOrderSchema), createOrder)
router.get('/', protect, listOrders)
router.get('/:id', optionalAuth, guestOrderLookupLimiter, getOrder)

export default router

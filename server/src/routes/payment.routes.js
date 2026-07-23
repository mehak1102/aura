import { Router } from 'express'
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/payment.controller.js'
import { protect, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post('/create-order', optionalAuth, createPaymentOrder)
router.post('/verify', optionalAuth, verifyPayment)

export default router

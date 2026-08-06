import { Router } from 'express'
import {
  createPaymentOrder,
  verifyPayment,
  razorpayWebhook,
} from '../controllers/payment.controller.js'
import { optionalAuth } from '../middleware/auth.js'
import {
  validateBody,
  paymentCreateSchema,
  paymentVerifySchema,
} from '../validation/schemas.js'

const router = Router()

router.post(
  '/create-order',
  optionalAuth,
  validateBody(paymentCreateSchema),
  createPaymentOrder,
)
router.post('/verify', optionalAuth, validateBody(paymentVerifySchema), verifyPayment)
router.post('/webhook', razorpayWebhook)

export default router

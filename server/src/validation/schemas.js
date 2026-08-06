import { z } from 'zod'
import { AppError } from '../utils/asyncHandler.js'

export function validateBody(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join('; ')
      next(new AppError(msg || 'Invalid request', 400))
      return
    }
    req.body = parsed.data
    next()
  }
}

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().trim().optional(),
})

export const createOrderSchema = z.object({
  shipping: z
    .object({
      fullName: z.string().trim().min(1),
      email: z.string().email(),
      phone: z.string().trim().min(1),
      line1: z.string().trim().min(1),
      line2: z.string().trim().optional(),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      postalCode: z.string().trim().min(1),
      country: z.string().trim().optional(),
      shippingMethod: z.string().optional(),
    })
    .passthrough(),
  items: z
    .array(
      z
        .object({
          productId: z.string().min(1),
          variantId: z.string().optional(),
          quantity: z.coerce.number().int().positive(),
        })
        .passthrough(),
    )
    .min(1, 'Items are required'),
  giftWrap: z.boolean().optional(),
  giftWrapFee: z.number().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod']),
  // Client ids / status / payment fields are ignored by the controller.
  id: z.string().optional(),
  status: z.string().optional(),
  paymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  subtotal: z.number().optional(),
  mrpTotal: z.number().optional(),
  savings: z.number().optional(),
  shippingFee: z.number().optional(),
  total: z.number().optional(),
})

export const paymentCreateSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  currency: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.record(z.string()).optional(),
  checkoutToken: z.string().optional(),
})

export const paymentVerifySchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  razorpay_payment_id: z.string().min(1, 'Payment id is required'),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
  checkoutToken: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  subject: z.string().trim().min(3, 'Subject is required').max(160),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
})

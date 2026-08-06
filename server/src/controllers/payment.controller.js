import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env } from '../config/env.js'
import { Order } from '../models/Order.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { razorpayConfigured } from '../utils/secrets.js'
import { markOrderPaidAndFulfill } from '../services/orderFulfillment.js'
import { isDbReady } from '../config/db.js'

function getRazorpay() {
  if (!razorpayConfigured()) return null
  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  })
}

export const createPaymentOrder = asyncHandler(async (req, res) => {
  if (env.isProd && !razorpayConfigured()) {
    throw new AppError('Online payments are not configured', 503)
  }

  const { currency = 'INR', receipt, notes, orderNumber } = req.body

  if (!orderNumber) {
    throw new AppError('Order number is required')
  }

  let amountPaise

  if (useMemory() || !isDbReady()) {
    throw new AppError(
      'Online payments require a database-backed order. Create the order first.',
      503,
    )
  }

  const order = await Order.findOne({ orderNumber })
  if (!order) throw new AppError('Order not found', 404)
  if (order.status === 'paid') {
    throw new AppError('Order is already paid', 400)
  }
  if (order.paymentMethod !== 'razorpay') {
    throw new AppError('Order is not set up for online payment', 400)
  }

  amountPaise = Math.round(Number(order.total) * 100)
  if (!amountPaise || amountPaise < 100) {
    throw new AppError('Order total must be at least ₹1')
  }

  const razorpay = getRazorpay()
  if (!razorpay) {
    // Dev-only demo mode — amount still comes from the server order
    res.json({
      success: true,
      data: {
        mode: 'demo',
        orderId: `order_demo_${Date.now()}`,
        amount: amountPaise,
        currency,
      },
    })
    return
  }

  const rzOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: receipt || orderNumber,
    notes: { ...(notes || {}), orderNumber },
  })

  await Order.findOneAndUpdate(
    { orderNumber },
    { razorpayOrderId: rzOrder.id },
  )

  res.json({
    success: true,
    data: {
      mode: 'live',
      orderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      keyId: env.razorpay.keyId,
    },
  })
})

export const verifyPayment = asyncHandler(async (req, res) => {
  if (env.isProd && !razorpayConfigured()) {
    throw new AppError('Online payments are not configured', 503)
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderNumber,
  } = req.body

  if (!razorpay_payment_id) {
    throw new AppError('Payment id is required')
  }
  if (!orderNumber) {
    throw new AppError('Order number is required')
  }

  // Amount always comes from the server order — never trust the client.
  const order = useMemory()
    ? null
    : await Order.findOne({ orderNumber })
  if (!useMemory()) {
    if (!order) throw new AppError('Order not found', 404)
  }
  const expectedPaise = order
    ? Math.round(Number(order.total) * 100)
    : null

  const razorpay = getRazorpay()
  if (!razorpay) {
    await markOrderPaidAndFulfill({
      orderNumber,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      expectedPaise,
    })
    res.json({
      success: true,
      data: { verified: true, mode: 'demo', paymentId: razorpay_payment_id },
    })
    return
  }

  if (!razorpay_order_id || !razorpay_signature) {
    throw new AppError('Missing Razorpay verification fields')
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex')

  if (expected !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400)
  }

  await markOrderPaidAndFulfill({
    orderNumber,
    paymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    expectedPaise,
  })

  res.json({
    success: true,
    data: {
      verified: true,
      mode: 'live',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    },
  })
})

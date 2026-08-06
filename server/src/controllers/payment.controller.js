import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env } from '../config/env.js'
import { Order } from '../models/Order.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { razorpayConfigured } from '../utils/secrets.js'
import { markOrderPaidAndFulfill } from '../services/orderFulfillment.js'
import { isDbReady } from '../config/db.js'
import { verifyCheckoutToken } from '../utils/checkoutToken.js'

function getRazorpay() {
  if (!razorpayConfigured()) return null
  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  })
}

function getUserId(req) {
  return req.user?.id || req.user?._id?.toString() || null
}

/** Logged-in owner or guest with a valid checkout token. */
function assertCanAccessOrder(req, order) {
  const userId = getUserId(req)
  const orderUserId = order.user?.toString?.() || order.user || null

  if (orderUserId) {
    if (!userId || userId !== orderUserId) {
      throw new AppError('Not authorized for this order', 403)
    }
    return
  }

  const token =
    req.body?.checkoutToken ||
    req.headers['x-checkout-token'] ||
    req.query?.checkoutToken

  if (!token) {
    throw new AppError('Checkout session required for this order', 403)
  }

  const claims = verifyCheckoutToken(token)
  const guestEmail = (order.guestEmail || order.shipping?.email || '')
    .toLowerCase()
    .trim()

  if (
    claims.orderNumber !== order.orderNumber ||
    claims.email !== guestEmail
  ) {
    throw new AppError('Checkout session does not match this order', 403)
  }
}

async function loadOrder(orderNumber) {
  if (useMemory() || !isDbReady()) {
    throw new AppError(
      'Online payments require a database-backed order. Create the order first.',
      503,
    )
  }
  const order = await Order.findOne({ orderNumber })
  if (!order) throw new AppError('Order not found', 404)
  return order
}

export const createPaymentOrder = asyncHandler(async (req, res) => {
  if (env.isProd && !razorpayConfigured()) {
    throw new AppError('Online payments are not configured', 503)
  }

  const { currency = 'INR', receipt, notes, orderNumber } = req.body
  if (!orderNumber) throw new AppError('Order number is required')

  const order = await loadOrder(orderNumber)
  assertCanAccessOrder(req, order)

  if (order.status === 'paid') {
    throw new AppError('Order is already paid', 400)
  }
  if (order.paymentMethod !== 'razorpay') {
    throw new AppError('Order is not set up for online payment', 400)
  }

  const amountPaise = Math.round(Number(order.total) * 100)
  if (!amountPaise || amountPaise < 100) {
    throw new AppError('Order total must be at least ₹1')
  }

  const razorpay = getRazorpay()
  if (!razorpay) {
    const demoId = `order_demo_${Date.now()}`
    await Order.findOneAndUpdate(
      { orderNumber },
      { razorpayOrderId: demoId },
    )
    res.json({
      success: true,
      data: {
        mode: 'demo',
        orderId: demoId,
        amount: amountPaise,
        currency,
      },
    })
    return
  }

  const rzOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: String(receipt || orderNumber).slice(0, 40),
    notes: { ...(notes || {}), orderNumber: String(orderNumber) },
  }).catch((err) => {
    const msg =
      err?.error?.description ||
      err?.message ||
      'Could not create Razorpay order'
    console.error('[razorpay] orders.create failed', err?.error || err)
    throw new AppError(msg, 502)
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

  if (!razorpay_payment_id) throw new AppError('Payment id is required')
  if (!orderNumber) throw new AppError('Order number is required')

  const order = await loadOrder(orderNumber)
  assertCanAccessOrder(req, order)

  const expectedPaise = Math.round(Number(order.total) * 100)

  const razorpay = getRazorpay()
  if (!razorpay) {
    // Demo mode: still require the payment order was created for this store order.
    if (
      order.razorpayOrderId &&
      razorpay_order_id &&
      order.razorpayOrderId !== razorpay_order_id
    ) {
      throw new AppError('Payment does not match this order', 400)
    }
    await markOrderPaidAndFulfill({
      orderNumber,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id || order.razorpayOrderId,
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

  if (!order.razorpayOrderId) {
    throw new AppError('No Razorpay order is linked to this store order', 400)
  }
  if (order.razorpayOrderId !== razorpay_order_id) {
    throw new AppError('Payment does not match this order', 400)
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex')

  if (expected !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400)
  }

  // Cross-check amount / status with Razorpay (never trust client amount).
  const payment = await razorpay.payments.fetch(razorpay_payment_id)
  if (payment.order_id !== razorpay_order_id) {
    throw new AppError('Payment is not linked to the Razorpay order', 400)
  }
  if (!['captured', 'authorized'].includes(payment.status)) {
    throw new AppError(`Payment status is ${payment.status}`, 400)
  }
  if (Number(payment.amount) !== expectedPaise) {
    throw new AppError('Payment amount does not match order total', 400)
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

/**
 * Razorpay webhook — prefers this over client verify for reliability.
 * Mount with express.raw so the signature covers the exact body bytes.
 */
export const razorpayWebhook = asyncHandler(async (req, res) => {
  if (!razorpayConfigured()) {
    throw new AppError('Online payments are not configured', 503)
  }

  const signature = req.headers['x-razorpay-signature']
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new AppError('Webhook secret is not configured', 503)
  }
  if (!signature) throw new AppError('Missing webhook signature', 400)

  const rawBody = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body))

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  if (expected !== signature) {
    throw new AppError('Invalid webhook signature', 400)
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  const eventName = event.event

  if (
    eventName === 'payment.captured' ||
    eventName === 'payment.authorized'
  ) {
    const payment = event.payload?.payment?.entity
    if (!payment?.id) {
      res.json({ success: true, ignored: true })
      return
    }

    const orderNumber =
      payment.notes?.orderNumber ||
      (payment.order_id
        ? (
            await Order.findOne({ razorpayOrderId: payment.order_id }).select(
              'orderNumber total',
            )
          )?.orderNumber
        : null)

    if (!orderNumber) {
      res.json({ success: true, ignored: true, reason: 'order_not_found' })
      return
    }

    const order = await Order.findOne({ orderNumber })
    if (!order) {
      res.json({ success: true, ignored: true, reason: 'order_not_found' })
      return
    }

    if (
      order.razorpayOrderId &&
      payment.order_id &&
      order.razorpayOrderId !== payment.order_id
    ) {
      throw new AppError('Webhook payment order mismatch', 400)
    }

    const expectedPaise = Math.round(Number(order.total) * 100)
    if (Number(payment.amount) !== expectedPaise) {
      throw new AppError('Webhook payment amount mismatch', 400)
    }

    await markOrderPaidAndFulfill({
      orderNumber,
      paymentId: payment.id,
      razorpayOrderId: payment.order_id || order.razorpayOrderId,
      expectedPaise,
    })
  }

  res.json({ success: true })
})

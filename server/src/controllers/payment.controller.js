import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env } from '../config/env.js'
import { Order } from '../models/Order.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore } from '../services/memoryStore.js'

function getRazorpay() {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) return null
  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  })
}

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt, notes } = req.body
  const amountPaise = Math.round(Number(amount))

  if (!amountPaise || amountPaise < 100) {
    throw new AppError('Amount must be at least ₹1 (100 paise)')
  }

  const razorpay = getRazorpay()
  if (!razorpay) {
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

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes: notes || {},
  })

  res.json({
    success: true,
    data: {
      mode: 'live',
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpay.keyId,
    },
  })
})

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderNumber,
  } = req.body

  if (!razorpay_payment_id) {
    throw new AppError('Payment id is required')
  }

  const razorpay = getRazorpay()
  if (!razorpay) {
    if (orderNumber) {
      if (useMemory()) {
        memoryStore.updateOrder(orderNumber, {
          status: 'paid',
          paymentId: razorpay_payment_id,
        })
      } else {
        await Order.findOneAndUpdate(
          { orderNumber },
          { status: 'paid', paymentId: razorpay_payment_id },
        )
      }
    }
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

  if (orderNumber) {
    if (useMemory()) {
      memoryStore.updateOrder(orderNumber, {
        status: 'paid',
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      })
    } else {
      await Order.findOneAndUpdate(
        { orderNumber },
        {
          status: 'paid',
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
        },
      )
    }
  }

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

import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { Order } from '../models/Order.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore, createOrderNumber } from '../services/memoryStore.js'
import {
  buildAuthoritativeLines,
  computeOrderTotals,
  decrementStock,
  incrementCouponUsage,
} from '../services/orderPricing.js'
import { sendOrderConfirmationEmail } from '../utils/mail.js'
import { signCheckoutToken, verifyCheckoutToken } from '../utils/checkoutToken.js'

function getUserId(req) {
  return req.user?.id || req.user?._id?.toString() || null
}

function requireShipping(shipping) {
  if (!shipping?.fullName?.trim() || !shipping?.email?.trim() || !shipping?.phone?.trim()) {
    throw new AppError('Name, email, and phone are required')
  }
  if (!shipping.line1?.trim() || !shipping.city?.trim() || !shipping.state?.trim()) {
    throw new AppError('A complete shipping address is required')
  }
  if (!shipping.postalCode?.trim()) {
    throw new AppError('Postal code is required')
  }
}

export const guestOrderLookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many lookups. Try again later.' },
})

export const listOrders = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  if (!userId) throw new AppError('Authentication required', 401)

  if (useMemory()) {
    res.json({ success: true, data: { orders: memoryStore.listOrders(userId) } })
    return
  }

  const docs = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(50)
  res.json({
    success: true,
    data: { orders: docs.map((d) => d.toClientJSON()) },
  })
})

export const getOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const checkoutToken =
    req.headers['x-checkout-token'] ||
    req.query.checkoutToken ||
    req.body?.checkoutToken

  if (useMemory()) {
    if (userId) {
      const order = memoryStore.getOrder(userId, req.params.id)
      if (!order) throw new AppError('Order not found', 404)
      res.json({ success: true, data: { order } })
      return
    }
    throw new AppError('Authentication required', 401)
  }

  let doc = null
  if (userId) {
    doc = await Order.findOne({ orderNumber: req.params.id, user: userId })
  } else if (checkoutToken) {
    const claims = verifyCheckoutToken(checkoutToken)
    if (claims.orderNumber !== req.params.id) {
      throw new AppError('Checkout session does not match this order', 403)
    }
    doc = await Order.findOne({
      orderNumber: req.params.id,
      isGuest: true,
      guestEmail: claims.email,
    })
  } else {
    throw new AppError(
      'Authentication or checkout session required',
      401,
    )
  }

  if (!doc) throw new AppError('Order not found', 404)
  res.json({ success: true, data: { order: doc.toClientJSON() } })
})

export const createOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const {
    shipping,
    items,
    giftWrap,
    couponCode,
    paymentMethod,
  } = req.body

  requireShipping(shipping)
  if (!items?.length) throw new AppError('Shipping details and items are required')
  if (!['razorpay', 'cod'].includes(paymentMethod)) {
    throw new AppError('Invalid payment method')
  }

  const rawLines = await buildAuthoritativeLines(items)
  const totals = await computeOrderTotals({
    lines: rawLines,
    shippingMethod: shipping.shippingMethod || 'standard',
    giftWrap: Boolean(giftWrap || (req.body.giftWrapFee && req.body.giftWrapFee > 0)),
    couponCode,
  })

  const orderLines = rawLines.map(({ _available, ...line }) => line)
  // Always mint server-side — never accept client order ids.
  const orderNumber = createOrderNumber()
  const isGuest = !userId
  const guestEmail = shipping.email.toLowerCase().trim()

  // Never trust client status / payment ids — only COD or pending until verified.
  const resolvedStatus = paymentMethod === 'cod' ? 'cod_placed' : 'pending'

  const payload = {
    orderNumber,
    user: userId || undefined,
    guestEmail: isGuest ? guestEmail : undefined,
    isGuest,
    status: resolvedStatus,
    paymentMethod,
    couponCode: totals.couponCode,
    inventoryDeducted: false,
    shipping: {
      ...shipping,
      email: guestEmail,
      shippingMethod: 'standard',
    },
    shippingFee: totals.shippingFee,
    giftWrapFee: totals.giftWrapFee,
    subtotal: totals.subtotal,
    mrpTotal: totals.mrpTotal,
    savings: totals.savings,
    discount: totals.discount,
    total: totals.total,
    items: orderLines,
  }

  const checkoutToken = isGuest
    ? signCheckoutToken({ orderNumber, email: guestEmail })
    : undefined

  if (useMemory()) {
    if (!userId) {
      throw new AppError(
        'Guest checkout requires MongoDB. Start the database or sign in.',
        503,
      )
    }
    const order = memoryStore.createOrder(userId, {
      id: orderNumber,
      ...payload,
      items: orderLines,
    })
    res.status(201).json({ success: true, data: { order } })
    return
  }

  if (resolvedStatus === 'cod_placed') {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const [doc] = await Order.create(
        [{ ...payload, inventoryDeducted: true }],
        { session },
      )
      await decrementStock(orderLines, session)
      if (totals.coupon) {
        await incrementCouponUsage(totals.coupon, session)
      }
      await session.commitTransaction()

      void sendOrderConfirmationEmail({
        to: guestEmail,
        orderId: orderNumber,
        total: totals.total,
      }).catch((err) => {
        console.error('[mail] order confirmation failed', err?.message || err)
      })

      res.status(201).json({
        success: true,
        data: {
          order: doc.toClientJSON(),
          ...(checkoutToken ? { checkoutToken } : {}),
        },
      })
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
    return
  }

  const doc = await Order.create(payload)
  res.status(201).json({
    success: true,
    data: {
      order: doc.toClientJSON(),
      ...(checkoutToken ? { checkoutToken } : {}),
    },
  })
})

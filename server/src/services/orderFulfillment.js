import mongoose from 'mongoose'
import { Order } from '../models/Order.model.js'
import { AppError } from '../utils/asyncHandler.js'
import { useMemory } from './dbMode.js'
import { memoryStore } from './memoryStore.js'
import {
  decrementStock,
  incrementCouponUsage,
} from './orderPricing.js'
import { sendOrderConfirmationEmail } from '../utils/mail.js'

/**
 * Atomically transition an order to `paid` and apply stock + coupon side effects
 * once. Concurrent calls are idempotent; COD orders that already reserved
 * inventory on create will only flip status.
 */
export async function markOrderPaidAndFulfill({
  orderNumber,
  paymentId,
  razorpayOrderId,
  expectedPaise,
}) {
  if (!orderNumber) throw new AppError('Order number is required')

  if (useMemory()) {
    const updated = memoryStore.updateOrder(orderNumber, {
      status: 'paid',
      paymentId,
      razorpayOrderId,
      inventoryDeducted: true,
    })
    if (!updated) throw new AppError('Order not found', 404)
    return updated
  }

  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const current = await Order.findOne({ orderNumber }).session(session)
    if (!current) throw new AppError('Order not found', 404)

    if (expectedPaise != null) {
      const serverPaise = Math.round(Number(current.total) * 100)
      if (serverPaise !== expectedPaise) {
        throw new AppError('Payment amount does not match order total', 400)
      }
    }

    if (current.status === 'paid') {
      await session.abortTransaction()
      return current
    }

    const patch = { status: 'paid' }
    if (paymentId) patch.paymentId = paymentId
    if (razorpayOrderId) patch.razorpayOrderId = razorpayOrderId

    // Only one concurrent caller wins this claim.
    const claimed = await Order.findOneAndUpdate(
      { orderNumber, status: { $ne: 'paid' } },
      { $set: patch },
      { new: true, session },
    )

    if (!claimed) {
      const existing = await Order.findOne({ orderNumber }).session(session)
      await session.abortTransaction()
      if (existing?.status === 'paid') return existing
      throw new AppError('Unable to mark order paid', 409)
    }

    if (!claimed.inventoryDeducted) {
      await decrementStock(claimed.items, session)
      if (claimed.couponCode) {
        await incrementCouponUsage(claimed.couponCode, session)
      }
      claimed.inventoryDeducted = true
      await claimed.save({ session })
    }

    await session.commitTransaction()

    void sendOrderConfirmationEmail({
      to: claimed.shipping?.email || claimed.guestEmail,
      orderId: claimed.orderNumber,
      total: claimed.total,
    })

    return claimed
  } catch (err) {
    try {
      await session.abortTransaction()
    } catch {
      // already aborted / not in a transaction
    }
    throw err
  } finally {
    session.endSession()
  }
}

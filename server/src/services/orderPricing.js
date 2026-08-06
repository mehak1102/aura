import mongoose from 'mongoose'
import { Product } from '../models/Product.model.js'
import { Coupon } from '../models/Coupon.model.js'
import { AppError } from '../utils/asyncHandler.js'
import { productCatalog } from './productCatalog.js'
import { getSiteSettings } from '../models/Settings.model.js'
import { isDbReady } from '../config/db.js'

const GIFT_WRAP_FEE = 99

/**
 * Rebuild order lines from the live catalog — never trust client prices.
 */
export async function buildAuthoritativeLines(items = []) {
  if (!items.length) throw new AppError('Cart is empty')

  const lines = []
  for (const item of items) {
    const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1))
    const product = await productCatalog.getByLegacyId(item.productId)
    if (!product) {
      throw new AppError(`Product unavailable: ${item.productId}`, 400)
    }

    const variant =
      product.variants?.find((v) => v.id === item.variantId) ||
      product.variants?.[0]
    if (!variant) {
      throw new AppError(`Variant unavailable for ${product.title}`, 400)
    }

    const available = Number(variant.stock ?? product.stock ?? 0)
    if (available < qty) {
      throw new AppError(
        `Only ${available} left for ${product.title} (${variant.name})`,
        400,
      )
    }

    const unitPrice = Number(variant.price)
    const mrp = Number(variant.mrp ?? product.mrp ?? unitPrice)
    lines.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      slug: product.slug,
      variantName: variant.name,
      image: product.images?.[0]?.url,
      quantity: qty,
      unitPrice,
      mrp,
      lineTotal: unitPrice * qty,
      _available: available,
    })
  }

  return lines
}

export async function computeOrderTotals({
  lines,
  shippingMethod = 'standard',
  giftWrap = false,
  couponCode,
}) {
  const settings = isDbReady()
    ? await getSiteSettings()
    : { freeShippingThreshold: 999 }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const mrpTotal = lines.reduce((s, l) => s + l.mrp * l.quantity, 0)
  const productSavings = Math.max(0, mrpTotal - subtotal)

  let discount = 0
  let appliedCoupon = null
  if (couponCode) {
    const code = String(couponCode).trim().toUpperCase()
    let coupon = null
    if (isDbReady()) {
      coupon = await Coupon.findOne({ code, isActive: true })
    }
    if (coupon) {
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new AppError('This promo code has expired', 400)
      }
      if (
        coupon.usageLimit != null &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        throw new AppError('This promo code is no longer available', 400)
      }
      if (subtotal < (coupon.minOrder || 0)) {
        throw new AppError(
          `Minimum order ₹${coupon.minOrder} required for this code`,
          400,
        )
      }
      if (coupon.discountType === 'percent') {
        discount = Math.round((subtotal * coupon.discountValue) / 100)
        if (coupon.maxDiscount != null) {
          discount = Math.min(discount, coupon.maxDiscount)
        }
      } else {
        discount = coupon.discountValue
      }
      discount = Math.min(discount, subtotal)
      appliedCoupon = coupon
    } else {
      throw new AppError('Invalid promo code', 400)
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount)
  const threshold = settings.freeShippingThreshold ?? 999
  // Standard shipping only (express removed)
  const shippingFee = afterDiscount >= threshold ? 0 : 79
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0
  const total = afterDiscount + shippingFee + giftWrapFee

  return {
    subtotal,
    mrpTotal,
    savings: productSavings + discount,
    discount,
    shippingFee,
    giftWrapFee,
    total,
    shippingMethod: 'standard',
    couponCode: appliedCoupon?.code || undefined,
    coupon: appliedCoupon,
  }
}

/**
 * Atomically decrement variant + product stock.
 * Fails with 409 if any line lacks sufficient stock (prevents oversell races).
 */
export async function decrementStock(lines, session) {
  if (!isDbReady()) return

  for (const line of lines) {
    const or = [{ legacyId: line.productId }]
    if (mongoose.isValidObjectId(line.productId)) {
      or.push({ _id: line.productId })
    }

    const opts = { new: true }
    if (session) opts.session = session

    const product = await Product.findOneAndUpdate(
      {
        $or: or,
        variants: {
          $elemMatch: {
            id: line.variantId,
            stock: { $gte: line.quantity },
          },
        },
      },
      {
        $inc: {
          'variants.$.stock': -line.quantity,
          stock: -line.quantity,
        },
      },
      opts,
    )

    if (!product) {
      throw new AppError(
        `Insufficient stock for ${line.title || line.productId}`,
        409,
      )
    }
  }
}

/**
 * Atomically bump coupon usedCount, respecting usageLimit.
 * Accepts a coupon document or a code string.
 */
export async function incrementCouponUsage(couponOrCode, session) {
  if (!couponOrCode || !isDbReady()) return

  const filter =
    typeof couponOrCode === 'string'
      ? { code: String(couponOrCode).trim().toUpperCase() }
      : couponOrCode._id
        ? { _id: couponOrCode._id }
        : couponOrCode.code
          ? { code: String(couponOrCode.code).trim().toUpperCase() }
          : null

  if (!filter) return

  const opts = { new: true }
  if (session) opts.session = session

  const updated = await Coupon.findOneAndUpdate(
    {
      ...filter,
      $expr: {
        $or: [
          { $eq: [{ $ifNull: ['$usageLimit', null] }, null] },
          { $lt: ['$usedCount', '$usageLimit'] },
        ],
      },
    },
    { $inc: { usedCount: 1 } },
    opts,
  )

  if (!updated) {
    const q = Coupon.findOne(filter)
    if (session) q.session(session)
    const exists = await q
    if (exists) {
      throw new AppError('Promo code is no longer available', 409)
    }
  }
}

export { GIFT_WRAP_FEE }

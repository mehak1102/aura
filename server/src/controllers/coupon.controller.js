import { Coupon } from '../models/Coupon.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'

const DEMO_COUPONS = [
  {
    code: 'AURA10',
    description: '10% off your ritual',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 500,
    maxDiscount: 300,
  },
  {
    code: 'WELCOME100',
    description: '₹100 off first order',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 799,
  },
]

function applyCoupon(coupon, subtotal) {
  if (subtotal < (coupon.minOrder || 0)) {
    throw new AppError(`Minimum order ₹${coupon.minOrder} required for this code`)
  }

  let discount = 0
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue
  } else {
    discount = Math.round((subtotal * coupon.discountValue) / 100)
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  }

  return {
    code: coupon.code,
    description: coupon.description,
    discount,
    total: Math.max(0, subtotal - discount),
  }
}

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body
  if (!code?.trim()) throw new AppError('Coupon code is required')

  const normalized = code.trim().toUpperCase()

  if (useMemory()) {
    const coupon = DEMO_COUPONS.find((c) => c.code === normalized)
    if (!coupon) throw new AppError('Invalid or expired coupon', 404)
    res.json({ success: true, data: applyCoupon(coupon, Number(subtotal)) })
    return
  }

  const coupon = await Coupon.findOne({
    code: normalized,
    isActive: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  })

  if (!coupon) throw new AppError('Invalid or expired coupon', 404)
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400)
  }

  res.json({
    success: true,
    data: applyCoupon(
      {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
      },
      Number(subtotal),
    ),
  })
})

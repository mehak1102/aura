import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, uppercase: true, trim: true },
    description: String,
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    discountValue: Number,
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Coupon =
  mongoose.models.Coupon || mongoose.model('Coupon', couponSchema)

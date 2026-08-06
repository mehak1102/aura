import mongoose from 'mongoose'

const orderLineSchema = new mongoose.Schema(
  {
    productId: String,
    variantId: String,
    title: String,
    slug: String,
    variantName: String,
    image: String,
    quantity: Number,
    unitPrice: Number,
    mrp: Number,
    lineTotal: Number,
  },
  { _id: false },
)

const shippingSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    notes: String,
    shippingMethod: { type: String, default: 'standard' },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    /** Guest checkout — order is keyed by email when user is absent. */
    guestEmail: { type: String, lowercase: true, trim: true, index: true },
    isGuest: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cod_placed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'] },
    paymentId: String,
    razorpayOrderId: String,
    couponCode: String,
    /** True once stock + coupon usage have been applied (COD create or payment). */
    inventoryDeducted: { type: Boolean, default: false },
    shipping: shippingSchema,
    shippingFee: Number,
    giftWrapFee: { type: Number, default: 0 },
    subtotal: Number,
    mrpTotal: Number,
    savings: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    items: [orderLineSchema],
  },
  { timestamps: true },
)

orderSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this.orderNumber,
    createdAt: this.createdAt.toISOString(),
    status: this.status,
    paymentMethod: this.paymentMethod,
    paymentId: this.paymentId,
    razorpayOrderId: this.razorpayOrderId,
    couponCode: this.couponCode,
    isGuest: this.isGuest,
    shipping: this.shipping,
    shippingFee: this.shippingFee,
    giftWrapFee: this.giftWrapFee ?? 0,
    subtotal: this.subtotal,
    mrpTotal: this.mrpTotal,
    savings: this.savings,
    discount: this.discount ?? 0,
    total: this.total,
    items: this.items,
  }
}

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema)

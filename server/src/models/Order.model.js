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
    status: {
      type: String,
      enum: ['pending', 'paid', 'cod_placed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'] },
    paymentId: String,
    razorpayOrderId: String,
    shipping: shippingSchema,
    shippingFee: Number,
    subtotal: Number,
    mrpTotal: Number,
    savings: Number,
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
    shipping: this.shipping,
    shippingFee: this.shippingFee,
    subtotal: this.subtotal,
    mrpTotal: this.mrpTotal,
    savings: this.savings,
    total: this.total,
    items: this.items,
  }
}

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema)

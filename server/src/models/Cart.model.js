import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: true },
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
)

export const Cart =
  mongoose.models.Cart || mongoose.model('Cart', cartSchema)

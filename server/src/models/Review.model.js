import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
    productLegacyId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: { type: String, required: true },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'published', 'hidden'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

reviewSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    productId: this.productLegacyId || this.product?.toString?.() || '',
    userName: this.userName,
    rating: this.rating,
    title: this.title,
    comment: this.comment,
    createdAt: this.createdAt.toISOString(),
    verified: this.verified,
    status: this.status || 'published',
  }
}

export const Review =
  mongoose.models.Review || mongoose.model('Review', reviewSchema)

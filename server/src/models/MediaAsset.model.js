import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    alt: { type: String, default: '' },
    folder: { type: String, default: 'aura-of-nature' },
    width: Number,
    height: Number,
    bytes: Number,
    format: String,
  },
  { timestamps: true },
)

mediaAssetSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    url: this.url,
    publicId: this.publicId,
    alt: this.alt,
    productTitle: this.alt || 'Upload',
    type: 'image',
    createdAt: this.createdAt?.toISOString?.(),
  }
}

export const MediaAsset =
  mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema)

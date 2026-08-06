import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    alt: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    isPrimary: Boolean,
  },
  { _id: false },
)

const variantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: String,
    sku: String,
    mrp: Number,
    price: Number,
    discountPercent: Number,
    stock: { type: Number, default: 0 },
    weight: String,
    size: String,
  },
  { _id: false },
)

const reviewSchema = new mongoose.Schema(
  {
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    title: String,
    comment: String,
    verified: Boolean,
  },
  { timestamps: true },
)

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    legacyId: { type: String, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    benefits: [String],
    ingredients: [String],
    howToUse: [String],
    skinTypes: [String],
    hairTypes: [String],
    tags: [String],
    concerns: [String],
    reviews: [reviewSchema],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    faqs: [faqSchema],
    images: [mediaSchema],
    gallery: [mediaSchema],
    videos: [mediaSchema],
    stock: { type: Number, default: 0 },
    variants: [variantSchema],
    mrp: Number,
    discountPercent: { type: Number, default: 0 },
    category: { type: String, index: true },
    subcategory: String,
    relatedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isBestSeller: Boolean,
    isNewArrival: Boolean,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this.legacyId || this._id.toString(),
    title: this.title,
    slug: this.slug,
    description: this.description,
    benefits: this.benefits,
    ingredients: this.ingredients,
    howToUse: this.howToUse,
    skinTypes: this.skinTypes,
    hairTypes: this.hairTypes,
    tags: this.tags,
    concerns: this.concerns,
    reviews: this.reviews,
    ratingAverage: this.ratingAverage,
    ratingCount: this.ratingCount,
    faqs: this.faqs,
    images: this.images,
    gallery: this.gallery,
    videos: this.videos,
    stock: this.stock,
    variants: this.variants,
    mrp: this.mrp,
    discountPercent: this.discountPercent,
    category: this.category,
    subcategory: this.subcategory,
    relatedProductIds: (this.relatedProductIds || []).map((id) => id.toString()),
    isBestSeller: this.isBestSeller,
    isNewArrival: this.isNewArrival,
    isActive: this.isActive !== false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)

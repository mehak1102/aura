import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

categorySchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this.slug,
    name: this.name,
    slug: this.slug,
    description: this.description,
  }
}

export const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema)

export const DEFAULT_CATEGORIES = [
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Face washes, soaps, and serums rooted in plant clarity.',
    sortOrder: 1,
  },
  {
    name: 'Body Care',
    slug: 'body-care',
    description: 'Body oils and baths that soften without overwhelm.',
    sortOrder: 2,
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Oils and treatments for scalp calm and lasting shine.',
    sortOrder: 3,
  },
  {
    name: 'Essential Oils',
    slug: 'essential-oils',
    description: 'Pure distillations for ritual, pulse points, and blends.',
    sortOrder: 4,
  },
  {
    name: 'Cold Pressed Oils',
    slug: 'cold-pressed-oils',
    description: 'Nutrient-rich oils pressed without heat.',
    sortOrder: 5,
  },
]

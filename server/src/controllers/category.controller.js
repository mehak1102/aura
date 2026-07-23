import { productCatalog } from '../services/productCatalog.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const CATEGORIES = [
  {
    id: 'skin-care',
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Face washes, soaps, and serums rooted in plant clarity.',
  },
  {
    id: 'body-care',
    name: 'Body Care',
    slug: 'body-care',
    description: 'Body oils and baths that soften without overwhelm.',
  },
  {
    id: 'hair-care',
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Oils and treatments for scalp calm and lasting shine.',
  },
  {
    id: 'essential-oils',
    name: 'Essential Oils',
    slug: 'essential-oils',
    description: 'Pure distillations for ritual, pulse points, and blends.',
  },
  {
    id: 'cold-pressed-oils',
    name: 'Cold Pressed Oils',
    slug: 'cold-pressed-oils',
    description: 'Nutrient-rich oils pressed without heat.',
  },
  {
    id: 'combos',
    name: 'Combos',
    slug: 'combos',
    description: 'Thoughtful pairings for complete rituals at a quieter price.',
  },
]

export const listCategories = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { categories: CATEGORIES } })
})

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = CATEGORIES.find((c) => c.slug === req.params.slug)
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' })
    return
  }
  const products = await productCatalog.list({ category: category.slug })
  res.json({ success: true, data: { category, products } })
})

import { Category, DEFAULT_CATEGORIES } from '../models/Category.model.js'
import { productCatalog } from '../services/productCatalog.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { isDbReady } from '../config/db.js'

/** @deprecated Prefer DB; kept for admin memory-mode mapping. */
export const CATEGORIES = DEFAULT_CATEGORIES.map((c) => ({
  id: c.slug,
  name: c.name,
  slug: c.slug,
  description: c.description,
}))

async function listFromDb() {
  let cats = await Category.find({ isActive: { $ne: false } })
    .sort({ sortOrder: 1, name: 1 })
    .lean()

  if (!cats.length) {
    await Category.insertMany(
      DEFAULT_CATEGORIES.map((c) => ({ ...c, isActive: true })),
    )
    cats = await Category.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
  }

  return cats.map((c) => ({
    id: c.slug,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
  }))
}

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = isDbReady() ? await listFromDb() : CATEGORIES
  res.json({ success: true, data: { categories } })
})

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  let category = null
  if (isDbReady()) {
    const doc = await Category.findOne({
      slug: req.params.slug,
      isActive: { $ne: false },
    })
    if (doc) {
      category = {
        id: doc.slug,
        name: doc.name,
        slug: doc.slug,
        description: doc.description || '',
      }
    }
  } else {
    category = CATEGORIES.find((c) => c.slug === req.params.slug) || null
  }

  if (!category) throw new AppError('Category not found', 404)

  const products = await productCatalog.list({ category: category.slug })
  res.json({ success: true, data: { category, products } })
})

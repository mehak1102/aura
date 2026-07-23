import catalog from '../data/catalog.json' with { type: 'json' }
import { Product } from '../models/Product.model.js'
import { isDbReady } from '../config/db.js'

function salePrice(product) {
  const variant = product.variants?.[0]
  if (variant?.price) return variant.price
  return Math.round(product.mrp * (1 - (product.discountPercent || 0) / 100))
}

function toClientProduct(doc) {
  const p = doc.toJSON ? doc.toJSON() : doc
  const fixUrl = (url = '') =>
    String(url).replace(/\.jpe?g$/i, '.png').replace(/\\/g, '/')
  const fixMedia = (list = []) =>
    list.map((m) => ({ ...m, url: fixUrl(m.url) }))

  return {
    ...p,
    id: p.id || p._id?.toString?.() || p.legacyId,
    concerns: p.concerns || [],
    reviews: p.reviews || [],
    faqs: p.faqs || [],
    images: fixMedia(p.images),
    gallery: fixMedia(p.gallery),
    videos: p.videos || [],
    relatedProductIds: (p.relatedProductIds || []).map((id) =>
      typeof id === 'object' ? id.toString() : String(id),
    ),
    createdAt: p.createdAt
      ? new Date(p.createdAt).toISOString().slice(0, 10)
      : p.createdAt,
    updatedAt: p.updatedAt
      ? new Date(p.updatedAt).toISOString().slice(0, 10)
      : p.updatedAt,
  }
}

function sortProducts(list, sort = 'featured') {
  const items = [...list]
  switch (sort) {
    case 'price-asc':
      return items.sort((a, b) => salePrice(a) - salePrice(b))
    case 'price-desc':
      return items.sort((a, b) => salePrice(b) - salePrice(a))
    case 'rating':
      return items.sort((a, b) => b.ratingAverage - a.ratingAverage)
    case 'newest':
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    default:
      return items.sort((a, b) => {
        const score = (p) =>
          (p.isBestSeller ? 2 : 0) + (p.isNewArrival ? 1 : 0)
        return score(b) - score(a) || b.ratingAverage - a.ratingAverage
      })
  }
}

function filterCatalog(list, query = {}) {
  let items = [...list]

  if (query.category && query.category !== 'all') {
    items = items.filter((p) => p.category === query.category)
  }
  if (query.concern && query.concern !== 'all') {
    items = items.filter((p) => p.concerns?.includes(query.concern))
  }
  if (query.skinType && query.skinType !== 'all') {
    items = items.filter(
      (p) =>
        p.skinTypes?.includes(query.skinType) || p.skinTypes?.includes('all'),
    )
  }
  if (query.hairType && query.hairType !== 'all') {
    items = items.filter(
      (p) =>
        p.hairTypes?.includes(query.hairType) || p.hairTypes?.includes('all'),
    )
  }
  if (query.ingredient) {
    const needle = query.ingredient.toLowerCase()
    items = items.filter((p) =>
      p.ingredients?.some((i) => i.toLowerCase().includes(needle)),
    )
  }
  if (query.query) {
    const q = query.query.toLowerCase()
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    )
  }
  if (query.minPrice) {
    items = items.filter((p) => salePrice(p) >= Number(query.minPrice))
  }
  if (query.maxPrice) {
    items = items.filter((p) => salePrice(p) <= Number(query.maxPrice))
  }
  if (query.bestSeller === '1' || query.bestSeller === true) {
    items = items.filter((p) => p.isBestSeller)
  }
  if (query.newArrival === '1' || query.newArrival === true) {
    items = items.filter((p) => p.isNewArrival)
  }

  return sortProducts(items, query.sort)
}

async function loadAllFromDb() {
  const docs = await Product.find({ isActive: { $ne: false } }).lean()
  if (!docs.length) return catalog.map((p) => ({ ...p }))
  return docs.map((d) =>
    toClientProduct({
      ...d,
      id: d.legacyId || d._id.toString(),
      relatedProductIds: (d.relatedProductIds || []).map((id) => id.toString()),
    }),
  )
}

export const productCatalog = {
  getStaticCatalog() {
    return catalog.map((p) => ({ ...p }))
  },

  async list(query = {}) {
    if (isDbReady()) {
      const count = await Product.countDocuments()
      const source = count ? await loadAllFromDb() : this.getStaticCatalog()
      return filterCatalog(source, query)
    }
    return filterCatalog(this.getStaticCatalog(), query)
  },

  async getBySlug(slug) {
    if (isDbReady()) {
      const doc = await Product.findOne({ slug, isActive: { $ne: false } })
      if (doc) return toClientProduct(doc)
    }
    return this.getStaticCatalog().find((p) => p.slug === slug) || null
  },

  async getByLegacyId(id) {
    if (isDbReady()) {
      const doc = await Product.findOne({
        $or: [{ legacyId: id }, { _id: id }],
        isActive: { $ne: false },
      })
      if (doc) return toClientProduct(doc)
    }
    return this.getStaticCatalog().find((p) => p.id === id) || null
  },

  getFilterMeta(products) {
    const concerns = new Set()
    const ingredients = new Set()
    let minPrice = Infinity
    let maxPrice = 0

    for (const p of products) {
      p.concerns?.forEach((c) => concerns.add(c))
      p.ingredients?.forEach((i) => ingredients.add(i))
      const price = salePrice(p)
      minPrice = Math.min(minPrice, price)
      maxPrice = Math.max(maxPrice, price)
    }

    return {
      concerns: [...concerns],
      ingredients: [...ingredients].slice(0, 40),
      priceRange: {
        min: Number.isFinite(minPrice) ? minPrice : 0,
        max: maxPrice || 0,
      },
    }
  },
}

import mongoose from 'mongoose'
import { Product } from '../models/Product.model.js'
import { Coupon } from '../models/Coupon.model.js'
import { Category, DEFAULT_CATEGORIES } from '../models/Category.model.js'
import { Review } from '../models/Review.model.js'
import { Blog } from '../models/Blog.model.js'
import { User } from '../models/User.model.js'
import { Order } from '../models/Order.model.js'
import { MediaAsset } from '../models/MediaAsset.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { isDbReady } from '../config/db.js'
import { slugify } from '../utils/slug.js'
import { productCatalog } from '../services/productCatalog.js'
import seedBlogs from '../data/blogs.json' with { type: 'json' }

function requireDb() {
  if (useMemory() || !isDbReady()) {
    throw new AppError('This action requires MongoDB', 503)
  }
}

async function findProductDoc(id) {
  const or = [{ legacyId: id }, { slug: id }]
  if (mongoose.isValidObjectId(id)) or.push({ _id: id })
  return Product.findOne({ $or: or })
}

function mapAdminProduct(doc) {
  const json = typeof doc.toClientJSON === 'function' ? doc.toClientJSON() : doc
  return {
    id: json.id,
    title: json.title,
    slug: json.slug,
    description: json.description || '',
    category: json.category,
    mrp: json.mrp,
    discountPercent: json.discountPercent || 0,
    stock: json.stock ?? 0,
    ratingAverage: json.ratingAverage || 0,
    ratingCount: json.ratingCount || 0,
    isBestSeller: Boolean(json.isBestSeller),
    isNewArrival: Boolean(json.isNewArrival),
    isActive: json.isActive !== false,
    images: json.images || [],
    variants: json.variants || [],
    benefits: json.benefits || [],
    ingredients: json.ingredients || [],
    howToUse: json.howToUse || [],
  }
}

function mapCoupon(d) {
  return {
    id: d._id.toString(),
    code: d.code,
    description: d.description || '',
    discountType: d.discountType,
    discountValue: d.discountValue,
    minOrder: d.minOrder || 0,
    maxDiscount: d.maxDiscount ?? null,
    isActive: d.isActive !== false,
    usedCount: d.usedCount || 0,
    usageLimit: d.usageLimit ?? null,
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
  }
}

function normalizeVariants(variants, { mrp, discountPercent, stock, title }) {
  if (Array.isArray(variants) && variants.length) {
    return variants.map((v, i) => {
      const variantMrp = Number(v.mrp ?? mrp) || 0
      const price =
        v.price != null
          ? Number(v.price)
          : Math.round(variantMrp * (1 - (Number(discountPercent) || 0) / 100))
      return {
        id: v.id || `var-${slugify(v.name || title || 'default')}-${i + 1}`,
        name: v.name || 'Standard',
        sku: v.sku || '',
        mrp: variantMrp,
        price,
        discountPercent: Number(v.discountPercent ?? discountPercent) || 0,
        stock: Math.max(0, Number(v.stock ?? stock) || 0),
        weight: v.weight || '',
        size: v.size || '',
      }
    })
  }

  const price = Math.round(
    Number(mrp) * (1 - (Number(discountPercent) || 0) / 100),
  )
  return [
    {
      id: `var-${slugify(title || 'default')}-1`,
      name: 'Standard',
      sku: '',
      mrp: Number(mrp) || 0,
      price,
      discountPercent: Number(discountPercent) || 0,
      stock: Math.max(0, Number(stock) || 0),
    },
  ]
}

function normalizeImages(images = []) {
  return (images || [])
    .filter((img) => img?.url)
    .map((img) => ({
      url: img.url,
      alt: img.alt || '',
      type: img.type || 'image',
      isPrimary: Boolean(img.isPrimary),
    }))
}

// ─── Products ───────────────────────────────────────────────────────────────

export const getAdminProduct = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await findProductDoc(req.params.id)
  if (!doc) throw new AppError('Product not found', 404)
  res.json({ success: true, data: { product: mapAdminProduct(doc) } })
})

export const createAdminProduct = asyncHandler(async (req, res) => {
  requireDb()
  const {
    title,
    slug: rawSlug,
    description,
    category,
    mrp,
    discountPercent = 0,
    stock = 0,
    images,
    variants,
    benefits,
    ingredients,
    howToUse,
    isActive = true,
    isBestSeller = false,
    isNewArrival = false,
  } = req.body

  if (!title?.trim()) throw new AppError('Title is required')
  if (!category?.trim()) throw new AppError('Category is required')
  if (mrp == null || Number(mrp) < 0) throw new AppError('Valid MRP is required')

  const slug = slugify(rawSlug || title)
  if (!slug) throw new AppError('Could not build a slug from the title')

  const exists = await Product.findOne({ slug })
  if (exists) throw new AppError('A product with this slug already exists', 409)

  const variantList = normalizeVariants(variants, {
    mrp,
    discountPercent,
    stock,
    title,
  })
  const totalStock = variantList.reduce((s, v) => s + (v.stock || 0), 0)

  const doc = await Product.create({
    legacyId: `custom-${slug}`,
    title: title.trim(),
    slug,
    description: description?.trim() || '',
    category: category.trim(),
    mrp: Number(mrp),
    discountPercent: Number(discountPercent) || 0,
    stock: totalStock || Number(stock) || 0,
    variants: variantList,
    images: normalizeImages(images),
    benefits: benefits || [],
    ingredients: ingredients || [],
    howToUse: howToUse || [],
    isActive: Boolean(isActive),
    isBestSeller: Boolean(isBestSeller),
    isNewArrival: Boolean(isNewArrival),
    ratingAverage: 0,
    ratingCount: 0,
  })

  res.status(201).json({ success: true, data: { product: mapAdminProduct(doc) } })
})

export const replaceAdminProduct = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await findProductDoc(req.params.id)
  if (!doc) throw new AppError('Product not found', 404)

  const {
    title,
    slug: rawSlug,
    description,
    category,
    mrp,
    discountPercent,
    stock,
    images,
    variants,
    benefits,
    ingredients,
    howToUse,
    isActive,
    isBestSeller,
    isNewArrival,
  } = req.body

  if (title != null) doc.title = String(title).trim()
  if (rawSlug != null || title != null) {
    const nextSlug = slugify(rawSlug || doc.title)
    if (nextSlug && nextSlug !== doc.slug) {
      const clash = await Product.findOne({ slug: nextSlug, _id: { $ne: doc._id } })
      if (clash) throw new AppError('A product with this slug already exists', 409)
      doc.slug = nextSlug
    }
  }
  if (description != null) doc.description = String(description)
  if (category != null) doc.category = String(category).trim()
  if (mrp != null) doc.mrp = Number(mrp)
  if (discountPercent != null) doc.discountPercent = Number(discountPercent)
  if (images != null) doc.images = normalizeImages(images)
  if (benefits != null) doc.benefits = benefits
  if (ingredients != null) doc.ingredients = ingredients
  if (howToUse != null) doc.howToUse = howToUse
  if (isActive != null) doc.isActive = Boolean(isActive)
  if (isBestSeller != null) doc.isBestSeller = Boolean(isBestSeller)
  if (isNewArrival != null) doc.isNewArrival = Boolean(isNewArrival)

  if (variants != null || stock != null || mrp != null || discountPercent != null) {
    doc.variants = normalizeVariants(variants ?? doc.variants, {
      mrp: doc.mrp,
      discountPercent: doc.discountPercent,
      stock: stock ?? doc.stock,
      title: doc.title,
    })
    doc.stock = doc.variants.reduce((s, v) => s + (v.stock || 0), 0)
  } else if (stock != null) {
    doc.stock = Number(stock)
  }

  await doc.save()
  res.json({ success: true, data: { product: mapAdminProduct(doc) } })
})

export const deleteAdminProduct = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await findProductDoc(req.params.id)
  if (!doc) throw new AppError('Product not found', 404)
  await doc.deleteOne()
  res.json({ success: true, message: 'Product deleted' })
})

// ─── Categories ─────────────────────────────────────────────────────────────

export const createAdminCategory = asyncHandler(async (req, res) => {
  requireDb()
  const { name, slug: rawSlug, description = '', sortOrder = 0, isActive = true } =
    req.body
  if (!name?.trim()) throw new AppError('Name is required')
  const slug = slugify(rawSlug || name)
  if (!slug) throw new AppError('Invalid slug')

  const exists = await Category.findOne({ slug })
  if (exists) throw new AppError('Category already exists', 409)

  const doc = await Category.create({
    name: name.trim(),
    slug,
    description: String(description || ''),
    sortOrder: Number(sortOrder) || 0,
    isActive: Boolean(isActive),
  })

  res.status(201).json({
    success: true,
    data: {
      category: {
        id: doc.slug,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        productCount: 0,
        isActive: doc.isActive,
        sortOrder: doc.sortOrder,
      },
    },
  })
})

export const updateAdminCategory = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await Category.findOne({ slug: req.params.slug })
  if (!doc) throw new AppError('Category not found', 404)

  const { name, description, sortOrder, isActive, slug: rawSlug } = req.body
  if (name != null) doc.name = String(name).trim()
  if (description != null) doc.description = String(description)
  if (sortOrder != null) doc.sortOrder = Number(sortOrder) || 0
  if (isActive != null) doc.isActive = Boolean(isActive)
  if (rawSlug != null) {
    const next = slugify(rawSlug)
    if (next && next !== doc.slug) {
      const clash = await Category.findOne({ slug: next })
      if (clash) throw new AppError('Slug already in use', 409)
      const oldSlug = doc.slug
      doc.slug = next
      await Product.updateMany({ category: oldSlug }, { category: next })
    }
  }
  await doc.save()

  const products = await productCatalog.list()
  res.json({
    success: true,
    data: {
      category: {
        id: doc.slug,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        productCount: products.filter((p) => p.category === doc.slug).length,
        isActive: doc.isActive,
        sortOrder: doc.sortOrder,
      },
    },
  })
})

export const deleteAdminCategory = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await Category.findOne({ slug: req.params.slug })
  if (!doc) throw new AppError('Category not found', 404)

  const inUse = await Product.countDocuments({ category: doc.slug })
  if (inUse > 0) {
    throw new AppError(
      `Cannot delete — ${inUse} product(s) still use this category`,
      400,
    )
  }

  await doc.deleteOne()
  res.json({ success: true, message: 'Category deleted' })
})

// ─── Coupons ────────────────────────────────────────────────────────────────

export const createAdminCoupon = asyncHandler(async (req, res) => {
  requireDb()
  const {
    code,
    description = '',
    discountType = 'percent',
    discountValue,
    minOrder = 0,
    maxDiscount,
    isActive = true,
    usageLimit,
    expiresAt,
  } = req.body

  if (!code?.trim()) throw new AppError('Code is required')
  if (discountValue == null || Number(discountValue) <= 0) {
    throw new AppError('Discount value must be positive')
  }
  if (!['percent', 'flat'].includes(discountType)) {
    throw new AppError('Invalid discount type')
  }

  const normalized = String(code).trim().toUpperCase()
  const exists = await Coupon.findOne({ code: normalized })
  if (exists) throw new AppError('Coupon code already exists', 409)

  const doc = await Coupon.create({
    code: normalized,
    description,
    discountType,
    discountValue: Number(discountValue),
    minOrder: Number(minOrder) || 0,
    maxDiscount: maxDiscount != null ? Number(maxDiscount) : undefined,
    isActive: Boolean(isActive),
    usageLimit: usageLimit != null ? Number(usageLimit) : undefined,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    usedCount: 0,
  })

  res.status(201).json({ success: true, data: { coupon: mapCoupon(doc) } })
})

export const updateAdminCoupon = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await Coupon.findById(req.params.id)
  if (!doc) throw new AppError('Coupon not found', 404)

  const {
    code,
    description,
    discountType,
    discountValue,
    minOrder,
    maxDiscount,
    isActive,
    usageLimit,
    expiresAt,
  } = req.body

  if (code != null) {
    const normalized = String(code).trim().toUpperCase()
    if (normalized !== doc.code) {
      const clash = await Coupon.findOne({ code: normalized })
      if (clash) throw new AppError('Coupon code already exists', 409)
      doc.code = normalized
    }
  }
  if (description != null) doc.description = description
  if (discountType != null) doc.discountType = discountType
  if (discountValue != null) doc.discountValue = Number(discountValue)
  if (minOrder != null) doc.minOrder = Number(minOrder) || 0
  if (maxDiscount !== undefined) {
    doc.maxDiscount = maxDiscount == null ? undefined : Number(maxDiscount)
  }
  if (isActive != null) doc.isActive = Boolean(isActive)
  if (usageLimit !== undefined) {
    doc.usageLimit = usageLimit == null ? undefined : Number(usageLimit)
  }
  if (expiresAt !== undefined) {
    doc.expiresAt = expiresAt ? new Date(expiresAt) : undefined
  }

  await doc.save()
  res.json({ success: true, data: { coupon: mapCoupon(doc) } })
})

export const deleteAdminCoupon = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await Coupon.findByIdAndDelete(req.params.id)
  if (!doc) throw new AppError('Coupon not found', 404)
  res.json({ success: true, message: 'Coupon deleted' })
})

// ─── Reviews ────────────────────────────────────────────────────────────────

export const updateAdminReview = asyncHandler(async (req, res) => {
  const { status, verified } = req.body
  if (status != null && !['pending', 'published', 'hidden'].includes(status)) {
    throw new AppError('Invalid review status')
  }

  const products = await productCatalog.list()

  if (useMemory() || !isDbReady()) {
    const { updateMemoryReview } = await import('../services/reviewStore.js')
    const patch = {}
    if (status != null) patch.status = status
    if (verified != null) patch.verified = Boolean(verified)
    const review = updateMemoryReview(req.params.id, patch)
    if (!review) throw new AppError('Review not found', 404)
    const product = products.find((p) => p.id === review.productId)
    res.json({
      success: true,
      data: {
        review: {
          ...review,
          productTitle: product?.title || 'Unknown product',
        },
      },
    })
    return
  }

  const doc = await Review.findById(req.params.id)
  if (!doc) throw new AppError('Review not found', 404)

  if (status != null) doc.status = status
  if (verified != null) doc.verified = Boolean(verified)
  await doc.save()

  if (doc.productLegacyId) {
    const { refreshProductRating } = await import('./review.controller.js')
    await refreshProductRating(doc.productLegacyId)
  }

  const product =
    products.find((p) => p.id === doc.productLegacyId) ||
    products.find((p) => p.id === doc.product?.toString?.())

  res.json({
    success: true,
    data: {
      review: {
        ...doc.toClientJSON(),
        productTitle: product?.title || 'Unknown product',
      },
    },
  })
})

export const deleteAdminReview = asyncHandler(async (req, res) => {
  if (useMemory() || !isDbReady()) {
    const { deleteMemoryReview } = await import('../services/reviewStore.js')
    const ok = deleteMemoryReview(req.params.id)
    if (!ok) throw new AppError('Review not found', 404)
    res.json({ success: true, message: 'Review deleted' })
    return
  }

  const doc = await Review.findByIdAndDelete(req.params.id)
  if (!doc) throw new AppError('Review not found', 404)
  if (doc.productLegacyId) {
    const { refreshProductRating } = await import('./review.controller.js')
    await refreshProductRating(doc.productLegacyId)
  }
  res.json({ success: true, message: 'Review deleted' })
})

// ─── Blogs ──────────────────────────────────────────────────────────────────

async function ensureBlogsSeeded() {
  const count = await Blog.countDocuments()
  if (count > 0) return
  if (!Array.isArray(seedBlogs) || !seedBlogs.length) return
  await Blog.insertMany(
    seedBlogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      category: b.category,
      author: b.author,
      excerpt: '',
      content: '',
      status: b.status || 'published',
      publishedAt: b.publishedAt ? new Date(b.publishedAt) : new Date(),
    })),
  )
}

export const listBlogsEnsured = asyncHandler(async (_req, res) => {
  if (useMemory() || !isDbReady()) {
    res.json({
      success: true,
      data: {
        blogs: seedBlogs.map((b) => ({
          ...b,
          excerpt: '',
          content: '',
          coverImage: '',
        })),
      },
    })
    return
  }

  await ensureBlogsSeeded()
  const docs = await Blog.find().sort({ publishedAt: -1, createdAt: -1 })
  res.json({
    success: true,
    data: { blogs: docs.map((d) => d.toAdminJSON()) },
  })
})

export const getAdminBlog = asyncHandler(async (req, res) => {
  requireDb()
  await ensureBlogsSeeded()
  const doc = mongoose.isValidObjectId(req.params.id)
    ? await Blog.findById(req.params.id)
    : await Blog.findOne({ slug: req.params.id })
  if (!doc) throw new AppError('Blog not found', 404)
  res.json({ success: true, data: { blog: doc.toAdminJSON() } })
})

export const createAdminBlog = asyncHandler(async (req, res) => {
  requireDb()
  const {
    title,
    slug: rawSlug,
    category = 'Journal',
    author = 'Aura Editorial',
    excerpt = '',
    content = '',
    coverImage = '',
    status = 'draft',
    publishedAt,
  } = req.body

  if (!title?.trim()) throw new AppError('Title is required')
  const slug = slugify(rawSlug || title)
  if (!slug) throw new AppError('Invalid slug')
  if (await Blog.findOne({ slug })) {
    throw new AppError('A post with this slug already exists', 409)
  }

  const resolvedStatus = status === 'published' ? 'published' : 'draft'
  const doc = await Blog.create({
    title: title.trim(),
    slug,
    category,
    author,
    excerpt,
    content,
    coverImage,
    status: resolvedStatus,
    publishedAt:
      resolvedStatus === 'published'
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null,
  })

  res.status(201).json({ success: true, data: { blog: doc.toAdminJSON() } })
})

export const updateAdminBlog = asyncHandler(async (req, res) => {
  requireDb()
  const doc = mongoose.isValidObjectId(req.params.id)
    ? await Blog.findById(req.params.id)
    : await Blog.findOne({ slug: req.params.id })
  if (!doc) throw new AppError('Blog not found', 404)

  const {
    title,
    slug: rawSlug,
    category,
    author,
    excerpt,
    content,
    coverImage,
    status,
    publishedAt,
  } = req.body

  if (title != null) doc.title = String(title).trim()
  if (rawSlug != null) {
    const next = slugify(rawSlug)
    if (next && next !== doc.slug) {
      if (await Blog.findOne({ slug: next, _id: { $ne: doc._id } })) {
        throw new AppError('Slug already in use', 409)
      }
      doc.slug = next
    }
  }
  if (category != null) doc.category = category
  if (author != null) doc.author = author
  if (excerpt != null) doc.excerpt = excerpt
  if (content != null) doc.content = content
  if (coverImage != null) doc.coverImage = coverImage
  if (status != null) {
    doc.status = status === 'published' ? 'published' : 'draft'
    if (doc.status === 'published' && !doc.publishedAt) {
      doc.publishedAt = publishedAt ? new Date(publishedAt) : new Date()
    }
    if (doc.status === 'draft') doc.publishedAt = null
  }
  if (publishedAt !== undefined && doc.status === 'published') {
    doc.publishedAt = publishedAt ? new Date(publishedAt) : new Date()
  }

  await doc.save()
  res.json({ success: true, data: { blog: doc.toAdminJSON() } })
})

export const deleteAdminBlog = asyncHandler(async (req, res) => {
  requireDb()
  const doc = mongoose.isValidObjectId(req.params.id)
    ? await Blog.findById(req.params.id)
    : await Blog.findOne({ slug: req.params.id })
  if (!doc) throw new AppError('Blog not found', 404)
  await doc.deleteOne()
  res.json({ success: true, message: 'Blog deleted' })
})

// ─── Users ──────────────────────────────────────────────────────────────────

export const updateAdminUser = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await User.findById(req.params.id)
  if (!doc) throw new AppError('User not found', 404)

  const actorId = req.user?._id?.toString?.() || req.user?.id
  const { role, isActive, name, phone } = req.body

  if (role != null) {
    if (!['customer', 'admin'].includes(role)) {
      throw new AppError('Invalid role')
    }
    if (doc._id.toString() === actorId && role !== 'admin') {
      throw new AppError('You cannot remove your own admin role', 400)
    }
    doc.role = role
  }
  if (isActive != null) {
    if (doc._id.toString() === actorId && !isActive) {
      throw new AppError('You cannot deactivate your own account', 400)
    }
    doc.isActive = Boolean(isActive)
  }
  if (name != null) doc.name = String(name).trim()
  if (phone !== undefined) doc.phone = phone?.trim() || undefined

  await doc.save()
  res.json({ success: true, data: { user: doc.toSafeJSON() } })
})

// ─── Orders ─────────────────────────────────────────────────────────────────

export const getAdminOrder = asyncHandler(async (req, res) => {
  requireDb()
  const doc = await Order.findOne({ orderNumber: req.params.id })
  if (!doc) throw new AppError('Order not found', 404)
  res.json({ success: true, data: { order: doc.toClientJSON() } })
})

// ─── Media registry ─────────────────────────────────────────────────────────

export const listMediaAssets = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const fromProducts = []
  const seen = new Set()
  for (const p of products) {
    for (const img of [...(p.images || []), ...(p.gallery || [])]) {
      if (!img.url || seen.has(img.url)) continue
      seen.add(img.url)
      fromProducts.push({
        id: `catalog-${fromProducts.length + 1}`,
        url: img.url,
        alt: img.alt || p.title,
        productTitle: p.title,
        type: img.type || 'image',
        source: 'catalog',
      })
    }
  }

  let uploads = []
  if (isDbReady()) {
    const docs = await MediaAsset.find().sort({ createdAt: -1 }).limit(48)
    uploads = docs.map((d) => ({ ...d.toClientJSON(), source: 'upload' }))
    for (const u of uploads) seen.add(u.url)
  }

  res.json({
    success: true,
    data: { assets: [...uploads, ...fromProducts].slice(0, 96) },
  })
})

export { DEFAULT_CATEGORIES }

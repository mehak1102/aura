import { productCatalog } from '../services/productCatalog.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryStore } from '../services/memoryStore.js'
import { memoryAuth } from '../services/memoryAuth.js'
import { User } from '../models/User.model.js'
import { Order } from '../models/Order.model.js'
import { Product } from '../models/Product.model.js'
import { Coupon } from '../models/Coupon.model.js'
import { Review } from '../models/Review.model.js'
import { CATEGORIES } from './category.controller.js'
import blogs from '../data/blogs.json' with { type: 'json' }

function startOfDay(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = startOfDay()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}

function aggregateOrders(orders) {
  const revenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'cod_placed')
    .reduce((s, o) => s + (o.total || 0), 0)

  const days = lastNDays(7)
  const salesByDay = days.map((day) => {
    const next = new Date(day)
    next.setDate(next.getDate() + 1)
    const dayOrders = orders.filter((o) => {
      const t = new Date(o.createdAt)
      return t >= day && t < next
    })
    return {
      date: day.toISOString().slice(0, 10),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
    }
  })

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  return {
    totalOrders: orders.length,
    revenue,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    statusCounts,
    salesByDay,
    recentOrders: orders.slice(0, 8),
  }
}

export const getDashboard = asyncHandler(async (_req, res) => {
  if (useMemory()) {
    const orders = memoryStore.listAllOrders()
    const users = memoryAuth.listUsers()
    const products = productCatalog.getStaticCatalog()
    const stats = aggregateOrders(orders)
    res.json({
      success: true,
      data: {
        ...stats,
        totalUsers: users.length,
        totalProducts: products.length,
        lowStock: products.filter((p) => (p.stock ?? 0) < 20).length,
      },
    })
    return
  }

  const [orders, userCount, productCount, lowStock] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(200).lean(),
    User.countDocuments(),
    Product.countDocuments({ isActive: { $ne: false } }),
    Product.countDocuments({ stock: { $lt: 20 }, isActive: { $ne: false } }),
  ])

  const normalized = orders.map((o) => ({
    id: o.orderNumber,
    createdAt: o.createdAt?.toISOString?.() || o.createdAt,
    status: o.status,
    total: o.total,
    paymentMethod: o.paymentMethod,
    shipping: o.shipping,
    items: o.items,
  }))

  const stats = aggregateOrders(normalized)
  res.json({
    success: true,
    data: {
      ...stats,
      totalUsers: userCount,
      totalProducts: productCount,
      lowStock,
    },
  })
})

export const listAdminOrders = asyncHandler(async (_req, res) => {
  if (useMemory()) {
    const orders = memoryStore.listAllOrders()
    res.json({ success: true, data: { orders } })
    return
  }

  const docs = await Order.find().sort({ createdAt: -1 }).limit(100)
  res.json({
    success: true,
    data: { orders: docs.map((d) => d.toClientJSON()) },
  })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'paid', 'cod_placed', 'failed', 'cancelled']
  if (!allowed.includes(status)) throw new AppError('Invalid status')

  if (useMemory()) {
    const order = memoryStore.updateOrder(req.params.id, { status })
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: { order } })
    return
  }

  const doc = await Order.findOneAndUpdate(
    { orderNumber: req.params.id },
    { status },
    { new: true },
  )
  if (!doc) throw new AppError('Order not found', 404)
  res.json({ success: true, data: { order: doc.toClientJSON() } })
})

export const listAdminUsers = asyncHandler(async (_req, res) => {
  if (useMemory()) {
    res.json({ success: true, data: { users: memoryAuth.listUsers() } })
    return
  }

  const users = await User.find().sort({ createdAt: -1 }).limit(100)
  res.json({
    success: true,
    data: { users: users.map((u) => u.toSafeJSON()) },
  })
})

export const listAdminProducts = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  res.json({
    success: true,
    data: {
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        mrp: p.mrp,
        discountPercent: p.discountPercent,
        stock: p.stock,
        ratingAverage: p.ratingAverage,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        isActive: p.isActive !== false,
      })),
    },
  })
})

export const updateAdminProduct = asyncHandler(async (req, res) => {
  const { stock, isActive, isBestSeller, isNewArrival, discountPercent } =
    req.body

  if (useMemory()) {
    res.json({
      success: true,
      data: {
        product: {
          id: req.params.id,
          stock,
          isActive,
          isBestSeller,
          isNewArrival,
          discountPercent,
        },
      },
      message: 'Product updates persist when MongoDB is seeded',
    })
    return
  }

  const doc = await Product.findOneAndUpdate(
    { $or: [{ legacyId: req.params.id }, { slug: req.params.id }] },
    {
      ...(stock !== undefined && { stock }),
      ...(isActive !== undefined && { isActive }),
      ...(isBestSeller !== undefined && { isBestSeller }),
      ...(isNewArrival !== undefined && { isNewArrival }),
      ...(discountPercent !== undefined && { discountPercent }),
    },
    { new: true },
  )
  if (!doc) throw new AppError('Product not found', 404)
  res.json({ success: true, data: { product: doc.toClientJSON() } })
})

const DEMO_COUPONS = [
  {
    id: 'coupon-1',
    code: 'AURA10',
    description: '10% off your ritual',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 500,
    maxDiscount: 300,
    isActive: true,
    usedCount: 42,
    usageLimit: 500,
  },
  {
    id: 'coupon-2',
    code: 'WELCOME100',
    description: '₹100 off first order',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 799,
    isActive: true,
    usedCount: 128,
    usageLimit: null,
  },
]

const SAMPLE_REVIEW_COMMENTS = [
  'Absolutely love this — my skin feels calm and nourished.',
  'Gentle formula, noticeable results within two weeks.',
  'The aroma is subtle and the texture melts in beautifully.',
  'Repurchasing for the third time. A staple in my ritual.',
  'Works well for my sensitive skin without any irritation.',
]

let adminSettings = {
  storeName: 'Aura of Nature',
  supportEmail: 'support@auraofnature.com',
  contactPhone: '+91 80 4567 8900',
  freeShippingThreshold: 999,
  lowStockThreshold: 20,
  currency: 'INR',
  notifyLowStock: true,
  notifyNewOrders: true,
}

function mapProductRow(p) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    mrp: p.mrp,
    discountPercent: p.discountPercent,
    stock: p.stock,
    ratingAverage: p.ratingAverage,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isActive: p.isActive !== false,
  }
}

function buildDemoReviews(products) {
  return products
    .filter((p) => p.ratingCount > 0)
    .slice(0, 12)
    .map((p, i) => ({
      id: `rev-${p.id}`,
      productId: p.id,
      productTitle: p.title,
      userName: ['Ananya R.', 'Priya M.', 'Rahul K.', 'Sneha D.'][i % 4],
      rating: Math.min(5, Math.max(4, Math.round(p.ratingAverage))),
      comment: SAMPLE_REVIEW_COMMENTS[i % SAMPLE_REVIEW_COMMENTS.length],
      createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      verified: true,
      status: 'published',
    }))
}

function collectMediaAssets(products) {
  const seen = new Set()
  const assets = []
  for (const p of products) {
    for (const img of [...(p.images || []), ...(p.gallery || [])]) {
      if (!img.url || seen.has(img.url)) continue
      seen.add(img.url)
      assets.push({
        id: `media-${assets.length + 1}`,
        url: img.url,
        alt: img.alt || p.title,
        productTitle: p.title,
        type: img.type || 'image',
      })
    }
  }
  return assets.slice(0, 48)
}

function buildNotifications(orders, products, threshold = 20) {
  const items = []
  for (const p of products.filter((x) => (x.stock ?? 0) < threshold)) {
    items.push({
      id: `low-${p.id}`,
      type: 'inventory',
      title: `Low stock: ${p.title}`,
      message: `${p.stock} units remaining`,
      createdAt: new Date().toISOString(),
      read: false,
    })
  }
  for (const o of orders.filter((x) => x.status === 'pending').slice(0, 6)) {
    items.push({
      id: `ord-${o.id}`,
      type: 'order',
      title: `Pending order ${o.id}`,
      message: `₹${o.total} awaiting payment`,
      createdAt: o.createdAt,
      read: false,
    })
  }
  return items.slice(0, 20)
}

export const listAdminCategories = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const categories = CATEGORIES.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.category === c.slug).length,
  }))
  res.json({ success: true, data: { categories } })
})

export const listAdminCoupons = asyncHandler(async (_req, res) => {
  if (useMemory()) {
    res.json({ success: true, data: { coupons: DEMO_COUPONS } })
    return
  }
  const docs = await Coupon.find().sort({ createdAt: -1 })
  res.json({
    success: true,
    data: {
      coupons: docs.map((d) => ({
        id: d._id.toString(),
        code: d.code,
        description: d.description,
        discountType: d.discountType,
        discountValue: d.discountValue,
        minOrder: d.minOrder,
        maxDiscount: d.maxDiscount,
        isActive: d.isActive,
        usedCount: d.usedCount,
        usageLimit: d.usageLimit,
      })),
    },
  })
})

export const listAdminReviews = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()

  if (useMemory()) {
    res.json({ success: true, data: { reviews: buildDemoReviews(products) } })
    return
  }

  const docs = await Review.find().sort({ createdAt: -1 }).limit(50)
  if (docs.length) {
    res.json({
      success: true,
      data: { reviews: docs.map((d) => d.toClientJSON()) },
    })
    return
  }

  res.json({ success: true, data: { reviews: buildDemoReviews(products) } })
})

export const listAdminBlogs = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { blogs } })
})

export const listAdminInventory = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const threshold = adminSettings.lowStockThreshold
  const rows = products
    .map(mapProductRow)
    .sort((a, b) => a.stock - b.stock)
  const lowStock = rows.filter((p) => p.stock < threshold)
  const outOfStock = rows.filter((p) => p.stock === 0)

  res.json({
    success: true,
    data: {
      items: rows,
      summary: {
        totalSkus: rows.length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        threshold,
      },
    },
  })
})

export const listAdminMedia = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  res.json({
    success: true,
    data: { assets: collectMediaAssets(products) },
  })
})

export const listAdminNotifications = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const orders = useMemory()
    ? memoryStore.listAllOrders()
    : (await Order.find().sort({ createdAt: -1 }).limit(20).lean()).map(
        (o) => ({
          id: o.orderNumber,
          status: o.status,
          total: o.total,
          createdAt: o.createdAt?.toISOString?.() || o.createdAt,
        }),
      )

  res.json({
    success: true,
    data: {
      notifications: buildNotifications(
        orders,
        products,
        adminSettings.lowStockThreshold,
      ),
    },
  })
})

export const getAdminSettings = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { settings: adminSettings } })
})

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const allowed = [
    'storeName',
    'supportEmail',
    'contactPhone',
    'freeShippingThreshold',
    'lowStockThreshold',
    'currency',
    'notifyLowStock',
    'notifyNewOrders',
  ]
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      adminSettings[key] = req.body[key]
    }
  }
  res.json({ success: true, data: { settings: adminSettings } })
})

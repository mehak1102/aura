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
import { Category, DEFAULT_CATEGORIES } from '../models/Category.model.js'
import {
  getSiteSettings,
  updateSiteSettings,
  DEFAULT_SETTINGS,
} from '../models/Settings.model.js'
import { isDbReady } from '../config/db.js'
import { markOrderPaidAndFulfill } from '../services/orderFulfillment.js'

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
  const paidLike = new Set([
    'paid',
    'cod_placed',
    'processing',
    'shipped',
    'delivered',
  ])
  const revenue = orders
    .filter((o) => paidLike.has(o.status))
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
  const allowed = [
    'pending',
    'paid',
    'cod_placed',
    'processing',
    'shipped',
    'delivered',
    'failed',
    'cancelled',
  ]
  if (!allowed.includes(status)) throw new AppError('Invalid status')

  if (useMemory()) {
    const order = memoryStore.updateOrder(req.params.id, { status })
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: { order } })
    return
  }

  const existing = await Order.findOne({ orderNumber: req.params.id })
  if (!existing) throw new AppError('Order not found', 404)

  // Marking paid must run the same stock + coupon path as payment verify.
  if (status === 'paid' && existing.status !== 'paid') {
    const fulfilled = await markOrderPaidAndFulfill({
      orderNumber: existing.orderNumber,
      paymentId: existing.paymentId || 'admin_manual',
      razorpayOrderId: existing.razorpayOrderId,
    })
    res.json({
      success: true,
      data: { order: fulfilled.toClientJSON() },
    })
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
    {
      $or: [
        { legacyId: req.params.id },
        { slug: req.params.id },
        ...(req.params.id.match(/^[a-f\d]{24}$/i)
          ? [{ _id: req.params.id }]
          : []),
      ],
    },
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

let memoryAdminSettings = { ...DEFAULT_SETTINGS }

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

  let base = CATEGORIES
  if (isDbReady()) {
    let docs = await Category.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
    if (!docs.length) {
      await Category.insertMany(
        DEFAULT_CATEGORIES.map((c) => ({ ...c, isActive: true })),
      )
      docs = await Category.find({ isActive: { $ne: false } })
        .sort({ sortOrder: 1, name: 1 })
        .lean()
    }
    base = docs.map((c) => ({
      id: c.slug,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
    }))
  }

  const categories = base.map((c) => ({
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
  const byId = new Map(products.map((p) => [p.id, p]))

  if (useMemory()) {
    const { listAllMemoryReviews } = await import('../services/reviewStore.js')
    const reviews = listAllMemoryReviews().map((r) => ({
      ...r,
      productTitle: byId.get(r.productId)?.title || 'Unknown product',
    }))
    res.json({ success: true, data: { reviews } })
    return
  }

  const docs = await Review.find().sort({ createdAt: -1 }).limit(100)
  res.json({
    success: true,
    data: {
      reviews: docs.map((d) => {
        const json = d.toClientJSON()
        const product =
          byId.get(json.productId) ||
          byId.get(d.productLegacyId) ||
          (d.product && byId.get(d.product.toString()))
        return {
          ...json,
          productTitle: product?.title || 'Unknown product',
        }
      }),
    },
  })
})

export const listAdminBlogs = asyncHandler(async (req, res, next) => {
  const { listBlogsEnsured } = await import('./adminCrud.controller.js')
  return listBlogsEnsured(req, res, next)
})

export const listAdminMedia = asyncHandler(async (req, res, next) => {
  const { listMediaAssets } = await import('./adminCrud.controller.js')
  return listMediaAssets(req, res, next)
})

export const listAdminInventory = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const settings = isDbReady()
    ? await getSiteSettings()
    : memoryAdminSettings
  const threshold = settings.lowStockThreshold
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

export const listAdminNotifications = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const settings = isDbReady()
    ? await getSiteSettings()
    : memoryAdminSettings
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
        settings.lowStockThreshold,
      ),
    },
  })
})

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = isDbReady()
    ? await getSiteSettings()
    : memoryAdminSettings
  res.json({ success: true, data: { settings } })
})

export const updateAdminSettings = asyncHandler(async (req, res) => {
  if (isDbReady()) {
    const settings = await updateSiteSettings(req.body)
    res.json({ success: true, data: { settings } })
    return
  }

  const allowed = Object.keys(DEFAULT_SETTINGS)
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      memoryAdminSettings[key] = req.body[key]
    }
  }
  res.json({ success: true, data: { settings: memoryAdminSettings } })
})

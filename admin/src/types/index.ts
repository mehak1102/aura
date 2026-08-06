export type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  mustChangePassword?: boolean
  isActive?: boolean
  createdAt?: string
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export type AdminProduct = {
  id: string
  title: string
  slug: string
  description?: string
  category: string
  mrp: number
  discountPercent: number
  stock: number
  ratingAverage: number
  ratingCount?: number
  isBestSeller?: boolean
  isNewArrival?: boolean
  isActive: boolean
  images?: { url: string; alt?: string; type?: string; isPrimary?: boolean }[]
  variants?: {
    id: string
    name: string
    sku?: string
    mrp: number
    price: number
    discountPercent?: number
    stock: number
  }[]
  benefits?: string[]
  ingredients?: string[]
  howToUse?: string[]
}

export type AdminOrder = {
  id: string
  createdAt: string
  status: string
  paymentMethod?: string
  paymentId?: string
  couponCode?: string
  total: number
  subtotal?: number
  shippingFee?: number
  giftWrapFee?: number
  discount?: number
  savings?: number
  shipping?: {
    fullName?: string
    email?: string
    phone?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    notes?: string
  }
  items?: {
    title?: string
    variantName?: string
    quantity?: number
    unitPrice?: number
    lineTotal?: number
    image?: string
  }[]
}

export type DashboardStats = {
  totalOrders: number
  revenue: number
  pendingOrders: number
  totalUsers: number
  totalProducts: number
  lowStock: number
  statusCounts: Record<string, number>
  salesByDay: { date: string; orders: number; revenue: number }[]
  recentOrders: AdminOrder[]
}

export type AdminCategory = {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  isActive?: boolean
  sortOrder?: number
}

export type AdminCoupon = {
  id: string
  code: string
  description: string
  discountType: 'percent' | 'flat'
  discountValue: number
  minOrder: number
  maxDiscount?: number | null
  isActive: boolean
  usedCount: number
  usageLimit?: number | null
  expiresAt?: string | null
}

export type AdminReview = {
  id: string
  productId: string
  productTitle: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  verified?: boolean
  status: string
}

export type AdminBlog = {
  id: string
  slug: string
  title: string
  category: string
  author: string
  excerpt?: string
  content?: string
  coverImage?: string
  status: 'published' | 'draft'
  publishedAt: string | null
}

export type InventorySummary = {
  totalSkus: number
  lowStock: number
  outOfStock: number
  threshold: number
}

export type AdminMedia = {
  id: string
  url: string
  alt: string
  productTitle: string
  type: string
  publicId?: string
  source?: string
}

export type AdminNotification = {
  id: string
  type: 'inventory' | 'order'
  title: string
  message: string
  createdAt: string
  read: boolean
}

export type AdminSettings = {
  storeName: string
  supportEmail: string
  contactPhone: string
  freeShippingThreshold: number
  lowStockThreshold: number
  currency: string
  notifyLowStock: boolean
  notifyNewOrders: boolean
}

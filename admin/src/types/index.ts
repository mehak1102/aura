export type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  mustChangePassword?: boolean
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
  category: string
  mrp: number
  discountPercent: number
  stock: number
  ratingAverage: number
  isBestSeller?: boolean
  isNewArrival?: boolean
  isActive: boolean
}

export type AdminOrder = {
  id: string
  createdAt: string
  status: string
  paymentMethod?: string
  total: number
  shipping?: { fullName?: string; city?: string }
  items?: { title?: string; quantity?: number }[]
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

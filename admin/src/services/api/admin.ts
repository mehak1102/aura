import { api } from './client'
import { ADMIN_API } from './endpoints'
import type {
  AdminOrder,
  AdminProduct,
  AdminCategory,
  AdminCoupon,
  AdminReview,
  AdminBlog,
  AdminMedia,
  AdminNotification,
  AdminSettings,
  InventorySummary,
  ApiResponse,
  DashboardStats,
  User,
} from '@/types'

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post<
      ApiResponse<{ user: User; token: string }>
    >(ADMIN_API.login, { email, password })
    return data.data
  },

  async me() {
    const { data } = await api.get<ApiResponse<{ user: User }>>(ADMIN_API.me)
    return data.data.user
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.post<ApiResponse<{ user: User }>>(
      ADMIN_API.changePassword,
      { currentPassword, newPassword },
    )
    return data.data.user
  },
}

export const adminApi = {
  async dashboard() {
    const { data } = await api.get<ApiResponse<DashboardStats>>(
      ADMIN_API.dashboard,
    )
    return data.data
  },

  async orders() {
    const { data } = await api.get<ApiResponse<{ orders: AdminOrder[] }>>(
      ADMIN_API.orders,
    )
    return data.data.orders
  },

  async updateOrderStatus(id: string, status: string) {
    const { data } = await api.patch<ApiResponse<{ order: AdminOrder }>>(
      ADMIN_API.orderStatus(id),
      { status },
    )
    return data.data.order
  },

  async users() {
    const { data } = await api.get<ApiResponse<{ users: User[] }>>(
      ADMIN_API.users,
    )
    return data.data.users
  },

  async products() {
    const { data } = await api.get<ApiResponse<{ products: AdminProduct[] }>>(
      ADMIN_API.products,
    )
    return data.data.products
  },

  async updateProduct(id: string, patch: Partial<AdminProduct>) {
    const { data } = await api.patch<ApiResponse<{ product: AdminProduct }>>(
      ADMIN_API.product(id),
      patch,
    )
    return data.data.product
  },

  async categories() {
    const { data } = await api.get<
      ApiResponse<{ categories: AdminCategory[] }>
    >(ADMIN_API.categories)
    return data.data.categories
  },

  async coupons() {
    const { data } = await api.get<ApiResponse<{ coupons: AdminCoupon[] }>>(
      ADMIN_API.coupons,
    )
    return data.data.coupons
  },

  async reviews() {
    const { data } = await api.get<ApiResponse<{ reviews: AdminReview[] }>>(
      ADMIN_API.reviews,
    )
    return data.data.reviews
  },

  async blogs() {
    const { data } = await api.get<ApiResponse<{ blogs: AdminBlog[] }>>(
      ADMIN_API.blogs,
    )
    return data.data.blogs
  },

  async inventory() {
    const { data } = await api.get<
      ApiResponse<{ items: AdminProduct[]; summary: InventorySummary }>
    >(ADMIN_API.inventory)
    return data.data
  },

  async media() {
    const { data } = await api.get<ApiResponse<{ assets: AdminMedia[] }>>(
      ADMIN_API.media,
    )
    return data.data.assets
  },

  async notifications() {
    const { data } = await api.get<
      ApiResponse<{ notifications: AdminNotification[] }>
    >(ADMIN_API.notifications)
    return data.data.notifications
  },

  async settings() {
    const { data } = await api.get<ApiResponse<{ settings: AdminSettings }>>(
      ADMIN_API.settings,
    )
    return data.data.settings
  },

  async updateSettings(patch: Partial<AdminSettings>) {
    const { data } = await api.patch<ApiResponse<{ settings: AdminSettings }>>(
      ADMIN_API.settings,
      patch,
    )
    return data.data.settings
  },
}

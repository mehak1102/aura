import { api } from './client'
import { ADMIN_API } from './endpoints'
import type {
  AdminOrder,
  AdminProduct,
  AdminCategory,
  AdminCoupon,
  AdminReview,
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

  async order(id: string) {
    const { data } = await api.get<ApiResponse<{ order: AdminOrder }>>(
      ADMIN_API.order(id),
    )
    return data.data.order
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

  async updateUser(id: string, patch: Partial<User>) {
    const { data } = await api.patch<ApiResponse<{ user: User }>>(
      ADMIN_API.user(id),
      patch,
    )
    return data.data.user
  },

  async products() {
    const { data } = await api.get<ApiResponse<{ products: AdminProduct[] }>>(
      ADMIN_API.products,
    )
    return data.data.products
  },

  async product(id: string) {
    const { data } = await api.get<ApiResponse<{ product: AdminProduct }>>(
      ADMIN_API.product(id),
    )
    return data.data.product
  },

  async createProduct(payload: Partial<AdminProduct>) {
    const { data } = await api.post<ApiResponse<{ product: AdminProduct }>>(
      ADMIN_API.products,
      payload,
    )
    return data.data.product
  },

  async updateProduct(id: string, patch: Partial<AdminProduct>) {
    const { data } = await api.patch<ApiResponse<{ product: AdminProduct }>>(
      ADMIN_API.product(id),
      patch,
    )
    return data.data.product
  },

  async saveProduct(id: string, payload: Partial<AdminProduct>) {
    const { data } = await api.put<ApiResponse<{ product: AdminProduct }>>(
      ADMIN_API.product(id),
      payload,
    )
    return data.data.product
  },

  async deleteProduct(id: string) {
    await api.delete(ADMIN_API.product(id))
  },

  async categories() {
    const { data } = await api.get<
      ApiResponse<{ categories: AdminCategory[] }>
    >(ADMIN_API.categories)
    return data.data.categories
  },

  async createCategory(payload: Partial<AdminCategory>) {
    const { data } = await api.post<ApiResponse<{ category: AdminCategory }>>(
      ADMIN_API.categories,
      payload,
    )
    return data.data.category
  },

  async updateCategory(slug: string, patch: Partial<AdminCategory>) {
    const { data } = await api.patch<ApiResponse<{ category: AdminCategory }>>(
      ADMIN_API.category(slug),
      patch,
    )
    return data.data.category
  },

  async deleteCategory(slug: string) {
    await api.delete(ADMIN_API.category(slug))
  },

  async coupons() {
    const { data } = await api.get<ApiResponse<{ coupons: AdminCoupon[] }>>(
      ADMIN_API.coupons,
    )
    return data.data.coupons
  },

  async createCoupon(payload: Partial<AdminCoupon>) {
    const { data } = await api.post<ApiResponse<{ coupon: AdminCoupon }>>(
      ADMIN_API.coupons,
      payload,
    )
    return data.data.coupon
  },

  async updateCoupon(id: string, patch: Partial<AdminCoupon>) {
    const { data } = await api.patch<ApiResponse<{ coupon: AdminCoupon }>>(
      ADMIN_API.coupon(id),
      patch,
    )
    return data.data.coupon
  },

  async deleteCoupon(id: string) {
    await api.delete(ADMIN_API.coupon(id))
  },

  async reviews() {
    const { data } = await api.get<ApiResponse<{ reviews: AdminReview[] }>>(
      ADMIN_API.reviews,
    )
    return data.data.reviews
  },

  async updateReview(id: string, patch: Partial<AdminReview>) {
    const { data } = await api.patch<ApiResponse<{ review: AdminReview }>>(
      ADMIN_API.review(id),
      patch,
    )
    return data.data.review
  },

  async deleteReview(id: string) {
    await api.delete(ADMIN_API.review(id))
  },

  async inventory() {
    const { data } = await api.get<
      ApiResponse<{ items: AdminProduct[]; summary: InventorySummary }>
    >(ADMIN_API.inventory)
    return data.data
  },

  async uploadImage(file: File, alt = '') {
    const form = new FormData()
    form.append('file', file)
    if (alt) form.append('alt', alt)
    const { data } = await api.post<
      ApiResponse<{
        url: string
        publicId: string
        id?: string
        alt?: string
      }>
    >(ADMIN_API.upload, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
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

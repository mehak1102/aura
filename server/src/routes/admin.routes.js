import { Router } from 'express'
import {
  protect,
  adminOnly,
  requirePasswordChanged,
} from '../middleware/auth.js'
import {
  getDashboard,
  listAdminOrders,
  updateOrderStatus,
  listAdminUsers,
  listAdminProducts,
  updateAdminProduct,
  listAdminCategories,
  listAdminCoupons,
  listAdminReviews,
  listAdminBlogs,
  listAdminInventory,
  listAdminMedia,
  listAdminNotifications,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/admin.controller.js'

const router = Router()

router.use(protect, adminOnly, requirePasswordChanged)

router.get('/dashboard', getDashboard)
router.get('/orders', listAdminOrders)
router.patch('/orders/:id', updateOrderStatus)
router.get('/users', listAdminUsers)
router.get('/products', listAdminProducts)
router.patch('/products/:id', updateAdminProduct)
router.get('/categories', listAdminCategories)
router.get('/coupons', listAdminCoupons)
router.get('/reviews', listAdminReviews)
router.get('/blogs', listAdminBlogs)
router.get('/inventory', listAdminInventory)
router.get('/media', listAdminMedia)
router.get('/notifications', listAdminNotifications)
router.get('/settings', getAdminSettings)
router.patch('/settings', updateAdminSettings)

export default router

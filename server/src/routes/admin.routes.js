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
import {
  getAdminProduct,
  createAdminProduct,
  replaceAdminProduct,
  deleteAdminProduct,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  updateAdminReview,
  deleteAdminReview,
  getAdminBlog,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
  updateAdminUser,
  getAdminOrder,
} from '../controllers/adminCrud.controller.js'

const router = Router()

router.use(protect, adminOnly, requirePasswordChanged)

router.get('/dashboard', getDashboard)

router.get('/orders', listAdminOrders)
router.get('/orders/:id', getAdminOrder)
router.patch('/orders/:id', updateOrderStatus)

router.get('/users', listAdminUsers)
router.patch('/users/:id', updateAdminUser)

router.get('/products', listAdminProducts)
router.post('/products', createAdminProduct)
router.get('/products/:id', getAdminProduct)
router.patch('/products/:id', updateAdminProduct)
router.put('/products/:id', replaceAdminProduct)
router.delete('/products/:id', deleteAdminProduct)

router.get('/categories', listAdminCategories)
router.post('/categories', createAdminCategory)
router.patch('/categories/:slug', updateAdminCategory)
router.delete('/categories/:slug', deleteAdminCategory)

router.get('/coupons', listAdminCoupons)
router.post('/coupons', createAdminCoupon)
router.patch('/coupons/:id', updateAdminCoupon)
router.delete('/coupons/:id', deleteAdminCoupon)

router.get('/reviews', listAdminReviews)
router.patch('/reviews/:id', updateAdminReview)
router.delete('/reviews/:id', deleteAdminReview)

router.get('/blogs', listAdminBlogs)
router.post('/blogs', createAdminBlog)
router.get('/blogs/:id', getAdminBlog)
router.patch('/blogs/:id', updateAdminBlog)
router.delete('/blogs/:id', deleteAdminBlog)

router.get('/inventory', listAdminInventory)
router.get('/media', listAdminMedia)
router.get('/notifications', listAdminNotifications)
router.get('/settings', getAdminSettings)
router.patch('/settings', updateAdminSettings)

export default router

import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import productRoutes from './product.routes.js'
import categoryRoutes from './category.routes.js'
import orderRoutes from './order.routes.js'
import cartRoutes from './cart.routes.js'
import wishlistRoutes from './wishlist.routes.js'
import couponRoutes from './coupon.routes.js'
import blogRoutes from './blog.routes.js'
import paymentRoutes from './payment.routes.js'
import uploadRoutes from './upload.routes.js'
import analyticsRoutes from './analytics.routes.js'
import adminRoutes from './admin.routes.js'
import instagramRoutes from './instagram.routes.js'
import settingsRoutes from './settings.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/cart', cartRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/coupons', couponRoutes)
router.use('/blogs', blogRoutes)
router.use('/payments', paymentRoutes)
router.use('/upload', uploadRoutes)
router.use('/settings', settingsRoutes)
router.use('/admin/analytics', analyticsRoutes)
router.use('/admin', adminRoutes)
router.use('/instagram', instagramRoutes)

export default router

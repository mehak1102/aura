import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  register,
  login,
  me,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again later.' },
})

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.get('/me', protect, me)
router.patch('/me', protect, updateProfile)
router.post('/logout', protect, logout)

export default router

import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  register,
  login,
  me,
  logout,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import { validateBody, loginSchema, registerSchema } from '../validation/schemas.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again later.' },
})

router.post('/register', authLimiter, validateBody(registerSchema), register)
router.post('/login', authLimiter, validateBody(loginSchema), login)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.get('/me', protect, me)
router.patch('/me', protect, updateProfile)
router.post('/change-password', protect, changePassword)
router.post('/logout', logout)

export default router

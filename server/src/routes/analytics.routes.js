import { getDashboard } from '../controllers/admin.controller.js'
import {
  protect,
  adminOnly,
  requirePasswordChanged,
} from '../middleware/auth.js'
import { Router } from 'express'

const router = Router()

router.get(
  '/dashboard',
  protect,
  adminOnly,
  requirePasswordChanged,
  getDashboard,
)

export default router

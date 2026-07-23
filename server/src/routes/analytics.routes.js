import { getDashboard } from '../controllers/admin.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { Router } from 'express'

const router = Router()

router.get('/dashboard', protect, adminOnly, getDashboard)

export default router

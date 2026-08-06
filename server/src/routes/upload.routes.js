import { Router } from 'express'
import {
  uploadMiddleware,
  uploadImage,
  deleteImage,
} from '../controllers/upload.controller.js'
import {
  protect,
  adminOnly,
  requirePasswordChanged,
} from '../middleware/auth.js'

const router = Router()

router.post(
  '/',
  protect,
  adminOnly,
  requirePasswordChanged,
  uploadMiddleware,
  uploadImage,
)
router.delete('/', protect, adminOnly, requirePasswordChanged, deleteImage)

export default router

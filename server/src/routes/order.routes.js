import { Router } from 'express'
import {
  listOrders,
  getOrder,
  createOrder,
} from '../controllers/order.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/', listOrders)
router.post('/', createOrder)
router.get('/:id', getOrder)

export default router

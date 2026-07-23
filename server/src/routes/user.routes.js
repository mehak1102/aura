import { Router } from 'express'
import {
  listAddresses,
  upsertAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/me/addresses', listAddresses)
router.post('/me/addresses', upsertAddress)
router.patch('/me/addresses/:id', upsertAddress)
router.delete('/me/addresses/:id', deleteAddress)
router.patch('/me/addresses/:id/default', setDefaultAddress)

export default router

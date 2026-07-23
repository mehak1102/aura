import { Router } from 'express'

const router = Router()

/** Phase 10 — review API */
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'review routes scaffolded' })
})

export default router

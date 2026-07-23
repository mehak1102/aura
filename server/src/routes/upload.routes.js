import { Router } from 'express'

const router = Router()

/** Phase 10 — upload API */
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'upload routes scaffolded' })
})

export default router

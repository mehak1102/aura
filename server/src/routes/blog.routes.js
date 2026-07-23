import { Router } from 'express'

const router = Router()

/** Phase 10 — blog API */
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'blog routes scaffolded' })
})

export default router

import { Router } from 'express'
import {
  getInstagramProfile,
  fetchProxiedImage,
  isAllowedInstagramImageUrl,
} from '../services/instagram.service.js'

const router = Router()

/** Public profile + posts (web scrape → cache → static fallback) */
router.get('/profile', async (_req, res) => {
  try {
    const feed = await getInstagramProfile()
    res.json({
      success: true,
      data: {
        profile: feed.profile,
        posts: feed.posts,
        source: feed.source,
        cached: feed.cached,
        stale: feed.stale,
        ...(feed.warning ? { warning: feed.warning } : {}),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load Instagram profile'
    res.status(500).json({ success: false, message })
  }
})

/** Legacy alias — same payload as /profile */
router.get('/feed', async (_req, res) => {
  try {
    const feed = await getInstagramProfile()
    res.json({
      success: true,
      data: {
        profile: feed.profile,
        posts: feed.posts,
        source: feed.source,
        cached: feed.cached,
        stale: feed.stale,
        ...(feed.warning ? { warning: feed.warning } : {}),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load Instagram feed'
    res.status(500).json({ success: false, message })
  }
})

/** Proxy Instagram CDN images (hotlink-safe) */
router.get('/image', async (req, res) => {
  const raw = typeof req.query.url === 'string' ? req.query.url : ''
  if (!raw) {
    return res.status(400).json({ success: false, message: 'url query required' })
  }

  let decoded
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid url' })
  }

  if (!isAllowedInstagramImageUrl(decoded)) {
    return res.status(400).json({ success: false, message: 'Host not allowed' })
  }

  try {
    const result = await fetchProxiedImage(decoded)
    if (result.redirectUrl) {
      return res.redirect(302, result.redirectUrl)
    }
    res.setHeader('Content-Type', result.contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
    return res.send(result.buffer)
  } catch (err) {
    const status = err?.status || 502
    const message = err instanceof Error ? err.message : 'Image proxy failed'
    return res.status(status).json({ success: false, message })
  }
})

export default router

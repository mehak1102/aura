import { Router } from 'express'
import { Blog } from '../models/Blog.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { isDbReady } from '../config/db.js'
import seedBlogs from '../data/blogs.json' with { type: 'json' }

const router = Router()

async function ensureSeeded() {
  if (!isDbReady()) return
  const count = await Blog.countDocuments()
  if (count > 0) return
  if (!Array.isArray(seedBlogs) || !seedBlogs.length) return
  await Blog.insertMany(
    seedBlogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      category: b.category,
      author: b.author,
      excerpt: '',
      content: '',
      status: b.status || 'published',
      publishedAt: b.publishedAt ? new Date(b.publishedAt) : new Date(),
    })),
  )
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    if (!isDbReady()) {
      res.json({
        success: true,
        data: {
          blogs: seedBlogs.filter((b) => b.status === 'published'),
        },
      })
      return
    }
    await ensureSeeded()
    const docs = await Blog.find({ status: 'published' }).sort({
      publishedAt: -1,
    })
    res.json({
      success: true,
      data: { blogs: docs.map((d) => d.toAdminJSON()) },
    })
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    if (!isDbReady()) {
      const blog = seedBlogs.find((b) => b.slug === req.params.slug)
      if (!blog) throw new AppError('Blog not found', 404)
      res.json({ success: true, data: { blog } })
      return
    }
    await ensureSeeded()
    const doc = await Blog.findOne({
      slug: req.params.slug,
      status: 'published',
    })
    if (!doc) throw new AppError('Blog not found', 404)
    res.json({ success: true, data: { blog: doc.toAdminJSON() } })
  }),
)

export default router

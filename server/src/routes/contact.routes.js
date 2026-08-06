import rateLimit from 'express-rate-limit'
import { Router } from 'express'
import { ContactInquiry } from '../models/ContactInquiry.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { isDbReady } from '../config/db.js'
import { sendContactNotificationEmail } from '../utils/mail.js'
import { getSiteSettings } from '../models/Settings.model.js'
import { validateBody, contactSchema } from '../validation/schemas.js'
import {
  protect,
  adminOnly,
  requirePasswordChanged,
} from '../middleware/auth.js'

const router = Router()

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Try again later.' },
})

router.post(
  '/',
  contactLimiter,
  validateBody(contactSchema),
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body

    if (!isDbReady()) {
      throw new AppError('Contact form requires the database', 503)
    }

    const doc = await ContactInquiry.create({
      name,
      email,
      subject,
      message,
      status: 'new',
    })

    let supportEmail = 'support@auraofnature.com'
    try {
      const settings = await getSiteSettings()
      if (settings.supportEmail) supportEmail = settings.supportEmail
    } catch {
      // ignore
    }

    void sendContactNotificationEmail({
      to: supportEmail,
      inquiry: doc.toAdminJSON(),
    })

    res.status(201).json({
      success: true,
      message: 'Message received',
      data: { id: doc._id.toString() },
    })
  }),
)

router.get(
  '/admin',
  protect,
  adminOnly,
  requirePasswordChanged,
  asyncHandler(async (req, res) => {
    if (!isDbReady()) throw new AppError('Database unavailable', 503)
    const status = req.query.status
    const filter = {}
    if (status && ['new', 'read', 'archived'].includes(String(status))) {
      filter.status = status
    }
    const docs = await ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
    res.json({
      success: true,
      data: { inquiries: docs.map((d) => d.toAdminJSON()) },
    })
  }),
)

router.patch(
  '/admin/:id',
  protect,
  adminOnly,
  requirePasswordChanged,
  asyncHandler(async (req, res) => {
    if (!isDbReady()) throw new AppError('Database unavailable', 503)
    const doc = await ContactInquiry.findById(req.params.id)
    if (!doc) throw new AppError('Inquiry not found', 404)
    const { status } = req.body
    if (!['new', 'read', 'archived'].includes(status)) {
      throw new AppError('Invalid status')
    }
    doc.status = status
    await doc.save()
    res.json({ success: true, data: { inquiry: doc.toAdminJSON() } })
  }),
)

export default router

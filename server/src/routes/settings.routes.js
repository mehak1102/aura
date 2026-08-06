import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getSiteSettings,
  DEFAULT_SETTINGS,
} from '../models/Settings.model.js'
import { isDbReady } from '../config/db.js'

const router = Router()

/** Public storefront settings (no secrets). */
router.get(
  '/public',
  asyncHandler(async (_req, res) => {
    const settings = isDbReady()
      ? await getSiteSettings()
      : DEFAULT_SETTINGS

    res.json({
      success: true,
      data: {
        storeName: settings.storeName,
        supportEmail: settings.supportEmail,
        contactPhone: settings.contactPhone,
        freeShippingThreshold: settings.freeShippingThreshold,
        currency: settings.currency,
      },
    })
  }),
)

export default router

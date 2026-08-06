import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'site' },
    storeName: { type: String, default: 'Aura of Nature' },
    supportEmail: { type: String, default: 'support@auraofnature.com' },
    contactPhone: { type: String, default: '+91 80 4567 8900' },
    freeShippingThreshold: { type: Number, default: 999 },
    lowStockThreshold: { type: Number, default: 20 },
    currency: { type: String, default: 'INR' },
    notifyLowStock: { type: Boolean, default: true },
    notifyNewOrders: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

export const DEFAULT_SETTINGS = {
  storeName: 'Aura of Nature',
  supportEmail: 'support@auraofnature.com',
  contactPhone: '+91 80 4567 8900',
  freeShippingThreshold: 999,
  lowStockThreshold: 20,
  currency: 'INR',
  notifyLowStock: true,
  notifyNewOrders: true,
}

export async function getSiteSettings() {
  let doc = await Settings.findOne({ key: 'site' })
  if (!doc) {
    doc = await Settings.create({ key: 'site', ...DEFAULT_SETTINGS })
  }
  return {
    storeName: doc.storeName,
    supportEmail: doc.supportEmail,
    contactPhone: doc.contactPhone,
    freeShippingThreshold: doc.freeShippingThreshold,
    lowStockThreshold: doc.lowStockThreshold,
    currency: doc.currency,
    notifyLowStock: doc.notifyLowStock,
    notifyNewOrders: doc.notifyNewOrders,
  }
}

export async function updateSiteSettings(patch = {}) {
  const allowed = Object.keys(DEFAULT_SETTINGS)
  const update = {}
  for (const key of allowed) {
    if (patch[key] !== undefined) update[key] = patch[key]
  }
  const doc = await Settings.findOneAndUpdate(
    { key: 'site' },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
  return {
    storeName: doc.storeName,
    supportEmail: doc.supportEmail,
    contactPhone: doc.contactPhone,
    freeShippingThreshold: doc.freeShippingThreshold,
    lowStockThreshold: doc.lowStockThreshold,
    currency: doc.currency,
    notifyLowStock: doc.notifyLowStock,
    notifyNewOrders: doc.notifyNewOrders,
  }
}

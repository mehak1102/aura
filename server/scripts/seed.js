import 'dotenv/config'
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { Product } from '../src/models/Product.model.js'
import { Coupon } from '../src/models/Coupon.model.js'
import { User } from '../src/models/User.model.js'
import { Category, DEFAULT_CATEGORIES } from '../src/models/Category.model.js'
import {
  Settings,
  DEFAULT_SETTINGS,
} from '../src/models/Settings.model.js'
import catalog from '../src/data/catalog.json' with { type: 'json' }

const DEMO_COUPONS = [
  {
    code: 'AURA10',
    description: '10% off your ritual',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 500,
    maxDiscount: 300,
    isActive: true,
  },
  {
    code: 'WELCOME100',
    description: '₹100 off first order',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 799,
    isActive: true,
  },
]

async function seed() {
  await mongoose.connect(env.mongoUri)
  console.log('Connected to MongoDB')

  for (const cat of DEFAULT_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { ...cat, isActive: true },
      { upsert: true, new: true },
    )
  }
  console.log(`Upserted ${DEFAULT_CATEGORIES.length} categories`)

  await Settings.findOneAndUpdate(
    { key: 'site' },
    { $setOnInsert: { key: 'site', ...DEFAULT_SETTINGS } },
    { upsert: true, new: true },
  )
  console.log('Ensured site settings document')

  const legacyIds = catalog.map((p) => p.id)
  await Product.deleteMany({ legacyId: { $in: legacyIds } })

  const idMap = new Map()
  for (const item of catalog) {
    const doc = await Product.create({
      legacyId: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      benefits: item.benefits,
      ingredients: item.ingredients,
      howToUse: item.howToUse,
      skinTypes: item.skinTypes,
      hairTypes: item.hairTypes,
      tags: item.tags,
      concerns: item.concerns || [],
      reviews: item.reviews || [],
      ratingAverage: item.ratingAverage,
      ratingCount: item.ratingCount,
      faqs: item.faqs || [],
      images: item.images,
      gallery: item.gallery || [],
      videos: item.videos || [],
      stock: item.stock,
      variants: item.variants,
      mrp: item.mrp,
      discountPercent: item.discountPercent,
      category: item.category,
      subcategory: item.subcategory,
      isBestSeller: item.isBestSeller,
      isNewArrival: item.isNewArrival,
      isActive: true,
    })
    idMap.set(item.id, doc._id)
  }

  for (const item of catalog) {
    const related = (item.relatedProductIds || [])
      .map((id) => idMap.get(id))
      .filter(Boolean)
    await Product.updateOne(
      { legacyId: item.id },
      { $set: { relatedProductIds: related } },
    )
  }

  for (const coupon of DEMO_COUPONS) {
    await Coupon.findOneAndUpdate({ code: coupon.code }, coupon, {
      upsert: true,
      new: true,
    })
  }

  const adminEmail = 'admin@auraofnature.com'
  const existingAdmin = await User.findOne({ email: adminEmail })
  if (!existingAdmin) {
    await User.create({
      name: 'Aura Admin',
      email: adminEmail,
      password: 'Admin1234!',
      role: 'admin',
      mustChangePassword: true,
    })
    console.log(
      `Created admin user: ${adminEmail} / Admin1234! (must change password)`,
    )
  } else {
    let dirty = false
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin'
      dirty = true
    }
    if (existingAdmin.mustChangePassword == null) {
      existingAdmin.mustChangePassword = true
      dirty = true
    }
    if (dirty) await existingAdmin.save()
  }

  console.log(
    `Seeded ${catalog.length} products and ${DEMO_COUPONS.length} coupons`,
  )
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

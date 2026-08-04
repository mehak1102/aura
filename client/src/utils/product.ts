import type { CatalogProduct } from '@/types/shop'
import { PRODUCTS } from '@/data/products'

/**
 * Prefer local catalog media (correct /public paths) when API returns stale .jpg etc.
 */
export function enrichProduct(product: CatalogProduct): CatalogProduct {
  const local = PRODUCTS.find(
    (p) => p.slug === product.slug || p.id === product.id || p.id === (product as { legacyId?: string }).legacyId,
  )

  if (!local) {
    return {
      ...product,
      images: (product.images ?? []).map(normalizeMedia),
      gallery: (product.gallery ?? []).map(normalizeMedia),
    }
  }

  return {
    ...product,
    images: local.images.length ? local.images : product.images.map(normalizeMedia),
    gallery: local.gallery.length ? local.gallery : (product.gallery ?? []).map(normalizeMedia),
    videos: local.videos?.length ? local.videos : product.videos,
    gender: product.gender ?? local.gender,
    concerns: product.concerns?.length ? product.concerns : local.concerns,
    category: (product.category || local.category) as CatalogProduct['category'],
  }
}

function normalizeMedia<T extends { url: string }>(media: T): T {
  return { ...media, url: normalizeProductUrl(media.url) }
}

/** Fix common API mismatches: .jpg → .png, decode spaces */
export function normalizeProductUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http')) return url
  let next = url.replace(/\\/g, '/')
  // Files on disk are PNG
  next = next.replace(/\.jpe?g$/i, '.png')
  // Prefer decoded path for folders like "Cucumber Seed"
  try {
    next = decodeURIComponent(next)
  } catch {
    /* keep */
  }
  return next
}

export function getEnrichedProductBySlug(slug: string) {
  const product = PRODUCTS.find((p) => p.slug === slug)
  return product ? enrichProduct(product) : undefined
}

export function getRelatedProducts(
  product: CatalogProduct,
  source: CatalogProduct[] = PRODUCTS,
  limit = 4,
) {
  const exclude = new Set([product.id])
  const pool = source.filter((p) => !exclude.has(p.id))

  const fromIds = product.relatedProductIds
    .map((id) => pool.find((p) => p.id === id))
    .filter(Boolean) as CatalogProduct[]

  const scored = pool
    .filter((p) => !product.relatedProductIds.includes(p.id))
    .map((p) => ({
      product: p,
      score: relatedScore(product, p),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.ratingAverage - a.product.ratingAverage)

  const merged = dedupeProducts([
    ...fromIds,
    ...scored.map((entry) => entry.product),
  ]).slice(0, limit)

  // If catalog is thin, fill with other items still excluding self
  if (merged.length < limit) {
    const used = new Set(merged.map((p) => p.id))
    const fillers = pool
      .filter((p) => !used.has(p.id))
      .sort((a, b) => b.ratingAverage - a.ratingAverage || Number(b.isBestSeller) - Number(a.isBestSeller))
    merged.push(...fillers.slice(0, limit - merged.length))
  }

  return merged.map(enrichProduct)
}

/**
 * Cross-category ritual companions — excludes current product and
 * anything already shown in "You may also like".
 */
export function getRecommendedProducts(
  product: CatalogProduct,
  source: CatalogProduct[] = PRODUCTS,
  limit = 4,
  excludeProducts: CatalogProduct[] = [],
) {
  const exclude = new Set([
    product.id,
    ...excludeProducts.map((p) => p.id),
    ...product.relatedProductIds,
  ])

  const pool = source.filter((p) => !exclude.has(p.id))

  const scored = pool
    .map((p) => ({
      product: p,
      score: ritualScore(product, p),
    }))
    .sort((a, b) => b.score - a.score || b.product.ratingAverage - a.product.ratingAverage)

  const picked = scored.slice(0, limit).map((entry) => entry.product)

  if (picked.length < limit) {
    const used = new Set(picked.map((p) => p.id))
    const fillers = pool
      .filter((p) => !used.has(p.id))
      .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.ratingAverage - a.ratingAverage)
    picked.push(...fillers.slice(0, limit - picked.length))
  }

  return picked.map(enrichProduct)
}

function relatedScore(current: CatalogProduct, candidate: CatalogProduct) {
  let score = 0

  if (candidate.category === current.category) score += 8
  if (candidate.subcategory && candidate.subcategory === current.subcategory) score += 4

  const sharedConcerns = candidate.concerns.filter((c) => current.concerns.includes(c)).length
  score += sharedConcerns * 3

  const sharedTags = candidate.tags.filter((t) => current.tags.includes(t)).length
  score += sharedTags

  if (candidate.gender && current.gender && candidate.gender === current.gender) score += 1
  if (candidate.isBestSeller) score += 1
  if (candidate.ratingAverage >= 4.7) score += 1

  return score
}

/** Prefer complementary categories that complete a ritual, not same-shelf duplicates. */
function ritualScore(current: CatalogProduct, candidate: CatalogProduct) {
  let score = 0
  const companions = RITUAL_COMPANIONS[current.category] ?? []

  if (companions.includes(candidate.category)) score += 10
  else if (candidate.category !== current.category) score += 4
  else score -= 6 // deprioritize same category (that's "You may also like")

  const sharedConcerns = candidate.concerns.filter((c) => current.concerns.includes(c)).length
  score += sharedConcerns * 4

  if (candidate.isBestSeller) score += 3
  if (candidate.isNewArrival) score += 2
  if (candidate.ratingAverage >= 4.7) score += 2
  if (candidate.ratingCount >= 50) score += 1

  return score
}

const RITUAL_COMPANIONS: Record<CatalogProduct['category'], CatalogProduct['category'][]> = {
  'skin-care': ['essential-oils', 'cold-pressed-oils', 'body-care'],
  'body-care': ['skin-care', 'essential-oils', 'cold-pressed-oils'],
  'hair-care': ['cold-pressed-oils', 'essential-oils', 'combos'],
  'essential-oils': ['skin-care', 'body-care', 'cold-pressed-oils', 'hair-care'],
  'cold-pressed-oils': ['hair-care', 'skin-care', 'essential-oils', 'body-care'],
  combos: ['skin-care', 'body-care', 'hair-care', 'essential-oils', 'cold-pressed-oils'],
}

function dedupeProducts(list: CatalogProduct[]) {
  const seen = new Set<string>()
  return list.filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

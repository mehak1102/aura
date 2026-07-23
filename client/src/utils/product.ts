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
  const related = product.relatedProductIds
    .map((id) => source.find((p) => p.id === id))
    .filter(Boolean) as CatalogProduct[]

  if (related.length >= limit) return related.slice(0, limit).map(enrichProduct)

  const fillers = source.filter(
    (p) =>
      p.id !== product.id &&
      !product.relatedProductIds.includes(p.id) &&
      (p.category === product.category ||
        p.concerns.some((c) => product.concerns.includes(c))),
  )

  return [...related, ...fillers]
    .slice(0, limit)
    .map((p) => enrichProduct(p))
}

export function getRecommendedProducts(
  product: CatalogProduct,
  source: CatalogProduct[] = PRODUCTS,
  limit = 4,
) {
  return source
    .filter(
      (p) => p.id !== product.id && (p.isBestSeller || p.ratingAverage >= 4.7),
    )
    .slice(0, limit)
    .map(enrichProduct)
}

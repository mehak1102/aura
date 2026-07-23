import type { CatalogProduct } from '@/types/shop'
import { ROUTES } from '@/routes/paths'

export const SITE_NAME = 'Aura of Nature'
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://www.auraofnature.com'

export const DEFAULT_DESCRIPTION =
  'Pure, natural, nourishing skincare, body care, hair care and essential oils — handcrafted botanical rituals.'

export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80'

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function productPath(slug: string) {
  return `/product/${slug}`
}

export function salePrice(product: Pick<CatalogProduct, 'mrp' | 'discountPercent'>) {
  return Math.round(product.mrp * (1 - (product.discountPercent || 0) / 100))
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/favicon.svg'),
    sameAs: [],
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}${ROUTES.search}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildProductJsonLd(product: CatalogProduct) {
  const price = salePrice(product)
  const image = product.images[0]?.url

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: image ? [image] : undefined,
    sku: product.variants[0]?.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(productPath(product.slug)),
      priceCurrency: 'INR',
      price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.ratingCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratingAverage,
            reviewCount: product.ratingCount,
          }
        : undefined,
  }
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

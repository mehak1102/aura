import { normalizeProductUrl } from '@utils/product'

/**
 * Shop cards use lighter `-card` variants when available.
 * Never double-append `-card`; always normalize extension/path first.
 */
export function productImageUrl(
  url: string,
  size: 'card' | 'full' = 'full',
) {
  if (!url) return ''
  const normalized = normalizeProductUrl(url)
  if (size === 'full') return encodeProductPath(normalized)

  // Already a card asset
  if (/-card\.(png|jpe?g|webp|gif)$/i.test(normalized)) {
    return encodeProductPath(normalized)
  }

  const dot = normalized.lastIndexOf('.')
  if (dot === -1) return encodeProductPath(normalized)
  const cardUrl = `${normalized.slice(0, dot)}-card${normalized.slice(dot)}`
  return encodeProductPath(cardUrl)
}

/** Encode only path segments that need it (e.g. "Cucumber Seed") */
function encodeProductPath(url: string) {
  if (!url.startsWith('/') || url.startsWith('http')) return url
  return url
    .split('/')
    .map((segment, i) => {
      if (i === 0) return segment
      try {
        return encodeURIComponent(decodeURIComponent(segment))
      } catch {
        return encodeURIComponent(segment)
      }
    })
    .join('/')
}

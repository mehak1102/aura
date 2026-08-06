import type { CatalogProduct } from '@/types/shop'
import type { ProductVariant } from '@/types'
import { enrichProduct } from '@utils/product'

export type StoredCartLine = {
  productId: string
  variantId: string
  quantity: number
}

export type CartLine = StoredCartLine & {
  product: CatalogProduct
  variant: ProductVariant
  lineTotal: number
}

const KEY = 'aura_cart'

/** Flat fee added when gift wrapping is selected */
export const GIFT_WRAP_FEE = 99

export function loadCart(): StoredCartLine[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredCartLine[]) : []
  } catch {
    return []
  }
}

export function saveCart(items: StoredCartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

/**
 * Combines a saved cart with the one in this browser. Quantities take the
 * larger of the two rather than summing, so signing in repeatedly cannot
 * inflate a line.
 */
export function mergeCartLines(
  saved: StoredCartLine[],
  local: StoredCartLine[],
): StoredCartLine[] {
  const merged = saved.map((line) => ({ ...line }))

  for (const line of local) {
    const match = merged.find(
      (i) => i.productId === line.productId && i.variantId === line.variantId,
    )
    if (match) match.quantity = Math.max(match.quantity, line.quantity)
    else merged.push({ ...line })
  }

  return merged
}

export function hydrateCart(
  items: StoredCartLine[],
  source: CatalogProduct[] = [],
): CartLine[] {
  return items
    .map((line) => {
      const base =
        source.find((p) => p.id === line.productId) ||
        source.find((p) => (p as CatalogProduct & { legacyId?: string }).legacyId === line.productId)
      if (!base) return null
      const product = enrichProduct(base)
      const variant =
        product.variants.find((v) => v.id === line.variantId) ??
        product.variants[0]
      if (!variant) return null
      return {
        ...line,
        // Normalize to catalog id so later lookups stay consistent
        productId: product.id,
        product,
        variant,
        lineTotal: variant.price * line.quantity,
      }
    })
    .filter(Boolean) as CartLine[]
}

/** Drop lines that no longer resolve in the catalog (stale / foreign ids). */
export function pruneCartLines(
  items: StoredCartLine[],
  source: CatalogProduct[],
): StoredCartLine[] {
  if (!source.length) return items
  return items.filter((line) =>
    source.some(
      (p) =>
        p.id === line.productId ||
        (p as CatalogProduct & { legacyId?: string }).legacyId ===
          line.productId,
    ),
  )
}

export function cartCount(items: StoredCartLine[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0)
}

export function cartMrpTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.variant.mrp * l.quantity, 0)
}

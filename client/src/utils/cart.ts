import type { CatalogProduct } from '@/types/shop'
import type { ProductVariant } from '@/types'
import { PRODUCTS } from '@/data/products'
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

export function hydrateCart(
  items: StoredCartLine[],
  source: CatalogProduct[] = PRODUCTS,
): CartLine[] {
  return items
    .map((line) => {
      const base = source.find((p) => p.id === line.productId)
      if (!base) return null
      const product = enrichProduct(base)
      const variant =
        product.variants.find((v) => v.id === line.variantId) ??
        product.variants[0]
      if (!variant) return null
      return {
        ...line,
        product,
        variant,
        lineTotal: variant.price * line.quantity,
      }
    })
    .filter(Boolean) as CartLine[]
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

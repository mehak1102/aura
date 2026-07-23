import type { CatalogProduct, ShopFilters, ShopSort } from '@/types/shop'
import { PRODUCTS } from '@/data/products'
import { calculateSalePrice } from '@utils/index'

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getSalePrice(product: CatalogProduct) {
  return calculateSalePrice(product.mrp, product.discountPercent)
}

export function getUniqueIngredients(source: CatalogProduct[] = PRODUCTS) {
  const set = new Set<string>()
  source.forEach((p) => p.ingredients.forEach((i) => set.add(i)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function filterProducts(
  filters: ShopFilters,
  source: CatalogProduct[] = PRODUCTS,
): CatalogProduct[] {
  let list = [...source]

  if (filters.category && filters.category !== 'all') {
    list = list.filter((p) => p.category === filters.category)
  }

  if (filters.bestSeller) {
    list = list.filter((p) => p.isBestSeller)
  }

  if (filters.newArrival) {
    list = list.filter((p) => p.isNewArrival)
  }

  if (filters.concern && filters.concern !== 'all') {
    const concern = filters.concern
    list = list.filter((p) => p.concerns.includes(concern))
  }

  if (filters.skinType && filters.skinType !== 'all') {
    const skinType = filters.skinType
    list = list.filter(
      (p) => p.skinTypes.includes('all') || p.skinTypes.includes(skinType),
    )
  }

  if (filters.hairType && filters.hairType !== 'all') {
    const hairType = filters.hairType
    list = list.filter(
      (p) => p.hairTypes.includes('all') || p.hairTypes.includes(hairType),
    )
  }

  if (filters.gender && filters.gender !== 'all') {
    const gender = filters.gender
    list = list.filter(
      (p) => (p.gender ?? 'unisex') === gender || (p.gender ?? 'unisex') === 'unisex',
    )
  }

  if (filters.ingredient) {
    const q = filters.ingredient.toLowerCase()
    list = list.filter((p) =>
      p.ingredients.some((i) => i.toLowerCase().includes(q)),
    )
  }

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.ingredients.some((i) => i.toLowerCase().includes(q)),
    )
  }

  if (typeof filters.minPrice === 'number') {
    list = list.filter((p) => getSalePrice(p) >= filters.minPrice!)
  }

  if (typeof filters.maxPrice === 'number') {
    list = list.filter((p) => getSalePrice(p) <= filters.maxPrice!)
  }

  return sortProducts(list, filters.sort ?? 'featured')
}

function sortProducts(list: CatalogProduct[], sort: ShopSort) {
  const next = [...list]
  switch (sort) {
    case 'price-asc':
      return next.sort((a, b) => getSalePrice(a) - getSalePrice(b))
    case 'price-desc':
      return next.sort((a, b) => getSalePrice(b) - getSalePrice(a))
    case 'rating':
      return next.sort((a, b) => b.ratingAverage - a.ratingAverage)
    case 'newest':
      return next.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'featured':
    default:
      return next.sort((a, b) => {
        const score = (p: CatalogProduct) =>
          (p.isBestSeller ? 2 : 0) + (p.isNewArrival ? 1 : 0) + p.ratingAverage
        return score(b) - score(a)
      })
  }
}

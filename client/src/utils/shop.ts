import type { CatalogProduct, ShopFilters, ShopSort } from '@/types/shop'
import { PRODUCTS } from '@/data/products'
import { calculateSalePrice } from '@utils/index'
import { fuzzyRank } from '@utils/fuzzy'

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

  if (filters.ingredient) {
    const q = filters.ingredient.toLowerCase()
    list = list.filter((p) =>
      p.ingredients.some((i) => i.toLowerCase().includes(q)),
    )
  }

  let rankedByQuery = false
  if (filters.query?.trim()) {
    list = fuzzyRank(filters.query.trim(), list, (p) => [
      { value: p.title },
      { value: p.ingredients.join(' '), weight: 0.9 },
      { value: p.tags.join(' '), weight: 0.8 },
      { value: p.category.replace(/-/g, ' '), weight: 0.7 },
      { value: p.description, weight: 0.5 },
    ])
    rankedByQuery = true
  }

  if (typeof filters.minPrice === 'number') {
    list = list.filter((p) => getSalePrice(p) >= filters.minPrice!)
  }

  if (typeof filters.maxPrice === 'number') {
    list = list.filter((p) => getSalePrice(p) <= filters.maxPrice!)
  }

  const sort = filters.sort ?? 'featured'
  // Relevance beats the default ordering when the shopper typed a query.
  if (rankedByQuery && sort === 'featured') return list

  return sortProducts(list, sort)
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

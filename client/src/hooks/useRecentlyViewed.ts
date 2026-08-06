import { useEffect, useState } from 'react'
import type { CatalogProduct } from '@/types/shop'
import { useCatalog } from '@contexts/CatalogContext'
import { enrichProduct } from '@utils/product'
import {
  getRecentlyViewedSlugs,
  pushRecentlyViewed,
} from '@utils/recentlyViewed'

export function useRecentlyViewed(currentSlug?: string) {
  const { products } = useCatalog()
  const [items, setItems] = useState<CatalogProduct[]>([])

  useEffect(() => {
    if (currentSlug) pushRecentlyViewed(currentSlug)
    const slugs = getRecentlyViewedSlugs().filter((s) => s !== currentSlug)
    setItems(
      slugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter(Boolean)
        .map((p) => enrichProduct(p!)),
    )
  }, [currentSlug, products])

  return items
}

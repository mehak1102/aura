import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { HairType, SkinType } from '@/types'
import type {
  ProductCategory,
  ProductConcern,
  ShopFilters,
  ShopSort,
} from '@/types/shop'
import { filterProducts } from '@utils/shop'
import { useCatalog } from '@contexts/CatalogContext'

const SORTS: ShopSort[] = [
  'featured',
  'price-asc',
  'price-desc',
  'rating',
  'newest',
]

const CATEGORIES: Array<ProductCategory | 'all'> = [
  'all',
  'skin-care',
  'body-care',
  'hair-care',
  'essential-oils',
  'cold-pressed-oils',
]

function asEnum<T extends string>(value: string | null, allowed: T[]): T | undefined {
  if (!value) return undefined
  return allowed.includes(value as T) ? (value as T) : undefined
}

export function useShopFilters(defaults: Partial<ShopFilters> = {}) {
  const [params, setParams] = useSearchParams()
  const { products: catalog } = useCatalog()

  const filters: ShopFilters = useMemo(() => {
    return {
      category:
        defaults.category ??
        asEnum(params.get('category'), CATEGORIES),
      concern: (params.get('concern') as ProductConcern | null) || defaults.concern,
      skinType: (params.get('skin') as SkinType | null) || undefined,
      hairType: (params.get('hair') as HairType | null) || undefined,
      ingredient: params.get('ingredient') || undefined,
      query: params.get('q') || defaults.query || undefined,
      minPrice: params.get('min') ? Number(params.get('min')) : undefined,
      maxPrice: params.get('max') ? Number(params.get('max')) : undefined,
      bestSeller: defaults.bestSeller || params.get('best') === '1',
      newArrival: defaults.newArrival || params.get('new') === '1',
      sort: asEnum(params.get('sort'), SORTS) ?? defaults.sort ?? 'featured',
    }
  }, [
    params,
    defaults.category,
    defaults.concern,
    defaults.query,
    defaults.bestSeller,
    defaults.newArrival,
    defaults.sort,
  ])

  const products = useMemo(
    () => filterProducts(filters, catalog),
    [filters, catalog],
  )

  const setFilter = (key: string, value?: string | number | boolean | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          value === false ||
          value === 'all'
        ) {
          next.delete(key)
        } else if (typeof value === 'boolean') {
          if (value) next.set(key, '1')
          else next.delete(key)
        } else {
          next.set(key, String(value))
        }
        return next
      },
      { replace: true },
    )
  }

  const clearFilters = () => {
    setParams({}, { replace: true })
  }

  return { filters, products, setFilter, clearFilters }
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import type { CatalogProduct } from '@/types/shop'
import { PRODUCTS } from '@/data/products'
import { enrichProduct } from '@utils/product'
import { productsApi } from '@services/api/products'

type CatalogContextValue = {
  products: CatalogProduct[]
  isLoading: boolean
  getBySlug: (slug: string) => CatalogProduct | undefined
  getById: (id: string) => CatalogProduct | undefined
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => productsApi.list(),
    staleTime: 30 * 60_000,
    placeholderData: PRODUCTS.map((p) => enrichProduct(p)),
  })

  const products = data ?? PRODUCTS.map((p) => enrichProduct(p))

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  )

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const value = useMemo(
    () => ({ products, isLoading, getBySlug, getById }),
    [products, isLoading, getBySlug, getById],
  )

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}

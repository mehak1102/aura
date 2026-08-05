import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCatalog } from '@contexts/CatalogContext'
import { enrichProduct } from '@utils/product'
import type { CatalogProduct } from '@/types/shop'
import { useAuth } from '@contexts/AuthContext'
import { wishlistApi } from '@services/api/wishlist'

const KEY = 'aura_wishlist'

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

type WishlistContextValue = {
  ids: string[]
  products: CatalogProduct[]
  count: number
  has: (productId: string) => boolean
  toggle: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  isSyncing: boolean
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getById } = useCatalog()
  const { isAuthenticated } = useAuth()
  const [ids, setIds] = useState<string[]>(() =>
    typeof window !== 'undefined' ? loadIds() : [],
  )
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // On sign-in, merge the guest list into the saved one instead of letting the
  // server response wipe hearts added before logging in
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(KEY, JSON.stringify(ids))
      return
    }

    let cancelled = false
    setIsSyncing(true)
    wishlistApi
      .get()
      .then((data) => {
        if (cancelled) return data
        const local = loadIds()
        const missing = local.filter((id) => !data.ids.includes(id))
        if (!missing.length) return data
        return wishlistApi.replace([...data.ids, ...missing])
      })
      .then((data) => {
        if (cancelled || !data) return
        setIds(data.ids)
        setProducts(data.products.map((p) => enrichProduct(p)))
        localStorage.setItem(KEY, JSON.stringify(data.ids))
      })
      .catch(() => {
        localStorage.setItem(KEY, JSON.stringify(ids))
      })
      .finally(() => {
        if (!cancelled) setIsSyncing(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const has = useCallback((productId: string) => ids.includes(productId), [ids])

  const toggle = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        wishlistApi
          .toggle(productId)
          .then((data) => {
            setIds(data.ids)
            setProducts(data.products.map((p) => enrichProduct(p)))
            localStorage.setItem(KEY, JSON.stringify(data.ids))
          })
          .catch(() => {
            setIds((prev) =>
              prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId],
            )
          })
        return
      }

      setIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
        localStorage.setItem(KEY, JSON.stringify(next))
        return next
      })
    },
    [isAuthenticated],
  )

  const remove = useCallback(
    (productId: string) => {
      if (ids.includes(productId)) toggle(productId)
    },
    [ids, toggle],
  )

  const clear = useCallback(() => {
    setIds([])
    setProducts([])
    localStorage.removeItem(KEY)
    if (isAuthenticated) {
      void wishlistApi.replace([]).catch(() => undefined)
    }
  }, [isAuthenticated])

  const displayProducts = useMemo(() => {
    if (products.length) return products
    return ids.map((id) => getById(id)).filter(Boolean) as CatalogProduct[]
  }, [products, ids, getById])

  const value = useMemo(
    () => ({
      ids,
      products: displayProducts,
      count: ids.length,
      has,
      toggle,
      remove,
      clear,
      isSyncing,
    }),
    [ids, displayProducts, has, toggle, remove, clear, isSyncing],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

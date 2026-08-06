import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

function persistIds(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids))
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
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id ?? null
  const [ids, setIds] = useState<string[]>(() =>
    typeof window !== 'undefined' ? loadIds() : [],
  )
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  // Isolate wishlist per account: clear on logout; load server list on login.
  // Guest hearts are only merged when going from logged-out → logged-in.
  useEffect(() => {
    const prev = prevUserIdRef.current
    prevUserIdRef.current = userId

    // First mount while auth is still resolving — keep local guest list
    if (prev === undefined && userId === null && !isAuthenticated) {
      return
    }

    // Logged out (or switched away from a user)
    if (!userId) {
      if (prev) {
        setIds([])
        setProducts([])
        localStorage.removeItem(KEY)
      } else {
        persistIds(ids)
      }
      return
    }

    let cancelled = false
    setIsSyncing(true)

    const guestIds = prev == null ? loadIds() : []

    wishlistApi
      .get()
      .then((data) => {
        if (cancelled) return data
        if (!guestIds.length) return data
        const missing = guestIds.filter((id) => !data.ids.includes(id))
        if (!missing.length) return data
        return wishlistApi.replace([...data.ids, ...missing])
      })
      .then((data) => {
        if (cancelled || !data) return
        setIds(data.ids)
        setProducts(data.products.map((p) => enrichProduct(p)))
        persistIds(data.ids)
      })
      .catch(() => {
        if (!cancelled) {
          setIds([])
          setProducts([])
          localStorage.removeItem(KEY)
        }
      })
      .finally(() => {
        if (!cancelled) setIsSyncing(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on account change
  }, [userId, isAuthenticated])

  // Persist guest (logged-out) wishlist only
  useEffect(() => {
    if (userId) return
    if (prevUserIdRef.current === undefined) return
    persistIds(ids)
  }, [ids, userId])

  const has = useCallback((productId: string) => ids.includes(productId), [ids])

  const toggle = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        wishlistApi
          .toggle(productId)
          .then((data) => {
            setIds(data.ids)
            setProducts(data.products.map((p) => enrichProduct(p)))
            persistIds(data.ids)
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
        persistIds(next)
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

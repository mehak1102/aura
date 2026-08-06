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
import { useAuth } from '@contexts/AuthContext'
import { cartApi } from '@services/api/cart'
import {
  cartCount,
  cartMrpTotal,
  cartSubtotal,
  GIFT_WRAP_FEE,
  hydrateCart,
  loadCart,
  mergeCartLines,
  pruneCartLines,
  saveCart,
  type CartLine,
  type StoredCartLine,
} from '@utils/cart'
import {
  couponsApi,
  promoErrorMessage,
  type AppliedPromo,
} from '@services/api/coupons'

const PROMO_KEY = 'aura_promo_code'

type CartContextValue = {
  items: StoredCartLine[]
  lines: CartLine[]
  count: number
  subtotal: number
  mrpTotal: number
  savings: number
  /** Coupon discount, clamped to the current subtotal */
  discount: number
  /** Subtotal after the coupon, before shipping / gift wrap */
  payable: number
  promo: AppliedPromo | null
  promoError: string | null
  promoPending: boolean
  applyPromo: (code: string) => Promise<boolean>
  removePromo: () => void
  justAdded: boolean
  giftWrap: boolean
  giftWrapFee: number
  setGiftWrap: (value: boolean) => void
  addItem: (productId: string, variantId: string, quantity?: number) => void
  updateQty: (productId: string, variantId: string, quantity: number) => void
  removeItem: (productId: string, variantId: string) => void
  clearCart: () => void
  clearJustAdded: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id ?? null
  const [items, setItems] = useState<StoredCartLine[]>(() =>
    typeof window !== 'undefined' ? loadCart() : [],
  )
  const [justAdded, setJustAdded] = useState(false)
  const [giftWrap, setGiftWrap] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('aura_gift_wrap') === '1'
  })
  /** Blocks the push-to-server effect while we are pulling from it */
  const hydratingRef = useRef(false)
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  const [promo, setPromo] = useState<AppliedPromo | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoPending, setPromoPending] = useState(false)

  useEffect(() => {
    saveCart(items)
  }, [items])

  // Per-account cart: clear on logout; load server cart on login.
  // Guest bag is only merged when going from logged-out → logged-in.
  useEffect(() => {
    const prev = prevUserIdRef.current
    prevUserIdRef.current = userId

    if (prev === undefined && userId === null && !isAuthenticated) {
      return
    }

    if (!userId) {
      if (prev) {
        hydratingRef.current = true
        setItems([])
        setGiftWrap(false)
        setPromo(null)
        setPromoError(null)
        localStorage.removeItem('aura_cart')
        localStorage.removeItem('aura_gift_wrap')
        localStorage.removeItem(PROMO_KEY)
        queueMicrotask(() => {
          hydratingRef.current = false
        })
      }
      return
    }

    let cancelled = false
    hydratingRef.current = true

    const guestItems = prev == null ? loadCart() : []

    cartApi
      .get()
      .then((serverItems) => {
        if (cancelled) return
        const merged =
          guestItems.length > 0
            ? mergeCartLines(serverItems, guestItems)
            : serverItems
        setItems(merged)
        const changed =
          merged.length !== serverItems.length ||
          merged.some((line) => {
            const match = serverItems.find(
              (i) =>
                i.productId === line.productId &&
                i.variantId === line.variantId,
            )
            return !match || match.quantity !== line.quantity
          })
        return changed ? cartApi.replace(merged) : undefined
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        hydratingRef.current = false
      })

    return () => {
      cancelled = true
      hydratingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAuthenticated])

  // Mirror later edits to the server, debounced so steppers don't spam it
  useEffect(() => {
    if (!isAuthenticated || hydratingRef.current) return

    const timer = window.setTimeout(() => {
      void cartApi.replace(items).catch(() => undefined)
    }, 600)

    return () => window.clearTimeout(timer)
  }, [items, isAuthenticated])

  useEffect(() => {
    localStorage.setItem('aura_gift_wrap', giftWrap ? '1' : '0')
  }, [giftWrap])

  // Drop / remap stale product ids once the catalog is available
  useEffect(() => {
    if (!products.length) return
    setItems((prev) => {
      const pruned = pruneCartLines(prev, products)
      const normalized = pruned.map((line) => {
        const match = products.find((p) => p.id === line.productId)
        return match ? { ...line, productId: match.id } : line
      })
      const same =
        normalized.length === prev.length &&
        normalized.every(
          (line, i) =>
            line.productId === prev[i]?.productId &&
            line.variantId === prev[i]?.variantId &&
            line.quantity === prev[i]?.quantity,
        )
      return same ? prev : normalized
    })
  }, [products])

  const lines = useMemo(() => hydrateCart(items, products), [items, products])
  // Badge matches what the cart page can actually show
  const count = useMemo(
    () => (products.length ? cartCount(lines) : cartCount(items)),
    [products.length, lines, items],
  )
  const subtotal = useMemo(() => cartSubtotal(lines), [lines])
  const mrpTotal = useMemo(() => cartMrpTotal(lines), [lines])
  const savings = Math.max(0, mrpTotal - subtotal)

  const applyPromo = useCallback(
    async (code: string) => {
      const trimmed = code.trim()
      if (!trimmed) {
        setPromoError('Enter a code first')
        return false
      }

      setPromoPending(true)
      setPromoError(null)
      try {
        const applied = await couponsApi.validate(trimmed, subtotal)
        setPromo(applied)
        localStorage.setItem(PROMO_KEY, applied.code)
        return true
      } catch (error) {
        setPromo(null)
        localStorage.removeItem(PROMO_KEY)
        setPromoError(promoErrorMessage(error))
        return false
      } finally {
        setPromoPending(false)
      }
    },
    [subtotal],
  )

  const removePromo = useCallback(() => {
    setPromo(null)
    setPromoError(null)
    localStorage.removeItem(PROMO_KEY)
  }, [])

  // Re-check the saved code whenever the bag total changes, since discounts
  // depend on the subtotal (percentage caps, minimum order)
  useEffect(() => {
    const saved = promo?.code ?? localStorage.getItem(PROMO_KEY)
    if (!saved) return
    if (!subtotal) {
      removePromo()
      return
    }

    let active = true
    couponsApi
      .validate(saved, subtotal)
      .then((applied) => {
        if (active) setPromo(applied)
      })
      .catch(() => {
        if (!active) return
        setPromo(null)
        localStorage.removeItem(PROMO_KEY)
      })

    return () => {
      active = false
    }
    // Intentionally keyed on the amount, not the promo object it updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, removePromo])

  const discount = Math.min(promo?.discount ?? 0, subtotal)
  const payable = Math.max(0, subtotal - discount)
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0

  const addItem = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      const catalogId =
        products.find((p) => p.id === productId)?.id ?? productId

      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === catalogId && i.variantId === variantId,
        )
        if (existing) {
          return prev.map((i) =>
            i.productId === catalogId && i.variantId === variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        }
        return [...prev, { productId: catalogId, variantId, quantity }]
      })
      setJustAdded(true)
    },
    [products],
  )

  const updateQty = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          )
        }
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i,
        )
      })
    },
    [],
  )

  const removeItem = useCallback((productId: string, variantId: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variantId === variantId),
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setGiftWrap(false)
    removePromo()
  }, [removePromo])
  const clearJustAdded = useCallback(() => setJustAdded(false), [])

  const value = useMemo(
    () => ({
      items,
      lines,
      count,
      subtotal,
      mrpTotal,
      savings,
      discount,
      payable,
      promo,
      promoError,
      promoPending,
      applyPromo,
      removePromo,
      justAdded,
      giftWrap,
      giftWrapFee,
      setGiftWrap,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      clearJustAdded,
    }),
    [
      items,
      lines,
      count,
      subtotal,
      mrpTotal,
      savings,
      discount,
      payable,
      promo,
      promoError,
      promoPending,
      applyPromo,
      removePromo,
      justAdded,
      giftWrap,
      giftWrapFee,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      clearJustAdded,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

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
import {
  cartCount,
  cartMrpTotal,
  cartSubtotal,
  hydrateCart,
  loadCart,
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
  /** Subtotal after the coupon, before shipping */
  payable: number
  promo: AppliedPromo | null
  promoError: string | null
  promoPending: boolean
  applyPromo: (code: string) => Promise<boolean>
  removePromo: () => void
  justAdded: boolean
  giftWrap: boolean
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
  const [items, setItems] = useState<StoredCartLine[]>(() =>
    typeof window !== 'undefined' ? loadCart() : [],
  )
  const [justAdded, setJustAdded] = useState(false)
  const [giftWrap, setGiftWrap] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('aura_gift_wrap') === '1'
  })

  useEffect(() => {
    saveCart(items)
  }, [items])

  useEffect(() => {
    localStorage.setItem('aura_gift_wrap', giftWrap ? '1' : '0')
  }, [giftWrap])

  const lines = useMemo(() => hydrateCart(items, products), [items, products])
  const count = useMemo(() => cartCount(items), [items])
  const subtotal = useMemo(() => cartSubtotal(lines), [lines])
  const mrpTotal = useMemo(() => cartMrpTotal(lines), [lines])
  const savings = Math.max(0, mrpTotal - subtotal)

  const [promo, setPromo] = useState<AppliedPromo | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoPending, setPromoPending] = useState(false)

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

  const addItem = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && i.variantId === variantId,
        )
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        }
        return [...prev, { productId, variantId, quantity }]
      })
      setJustAdded(true)
    },
    [],
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

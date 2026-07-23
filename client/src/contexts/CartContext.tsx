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

type CartContextValue = {
  items: StoredCartLine[]
  lines: CartLine[]
  count: number
  subtotal: number
  mrpTotal: number
  savings: number
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

  const clearCart = useCallback(() => setItems([]), [])
  const clearJustAdded = useCallback(() => setJustAdded(false), [])

  const value = useMemo(
    () => ({
      items,
      lines,
      count,
      subtotal,
      mrpTotal,
      savings,
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

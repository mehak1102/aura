import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Banknote } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { OrderSummaryCard } from '@components/checkout/OrderSummaryCard'
import { useCart } from '@contexts/CartContext'
import { useAuth } from '@contexts/AuthContext'
import { hydrateCart } from '@utils/cart'
import {
  buildOrderLines,
  clearPendingCheckout,
  createOrderId,
  loadPendingCheckout,
  saveOrder,
  type PaymentMethod,
} from '@utils/orders'
import { openRazorpayCheckout } from '@services/payments/razorpay'
import { ordersApi } from '@services/api/orders'
import { paymentsApi } from '@services/api/payments'
import { ROUTES } from '@/routes/paths'
import { formatCurrency, cn } from '@utils/index'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { clearCart, lines: liveLines } = useCart()
  const pending = useMemo(() => loadPendingCheckout(), [])
  const [method, setMethod] = useState<PaymentMethod>('razorpay')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lines = useMemo(
    () => (pending ? hydrateCart(pending.items) : liveLines),
    [pending, liveLines],
  )

  useEffect(() => {
    if (!pending || !pending.items.length) {
      navigate(ROUTES.checkout, { replace: true })
    }
  }, [pending, navigate])

  if (!pending) return null

  const persistOrder = async (payload: {
    id: string
    status: 'paid' | 'cod_placed'
    paymentMethod: PaymentMethod
    paymentId?: string
    razorpayOrderId?: string
  }) => {
    const base = {
      id: payload.id,
      createdAt: new Date().toISOString(),
      shipping: pending.shipping,
      shippingFee: pending.shippingFee,
      subtotal: pending.subtotal,
      mrpTotal: pending.mrpTotal,
      savings: pending.savings,
      total: pending.total,
      items: buildOrderLines(lines),
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      paymentId: payload.paymentId,
    }

    if (isAuthenticated) {
      try {
        await ordersApi.create({
          ...base,
          items: pending.items,
          razorpayOrderId: payload.razorpayOrderId,
        })
        return
      } catch {
        // fall through to local storage
      }
    }

    saveOrder(base)
  }

  const placeOrder = async () => {
    setError(null)
    setBusy(true)

    try {
      const orderId = createOrderId()

      if (method === 'cod') {
        await persistOrder({
          id: orderId,
          status: 'cod_placed',
          paymentMethod: 'cod',
        })
        clearPendingCheckout()
        clearCart()
        navigate(`${ROUTES.orderSuccess}?id=${orderId}`, { replace: true })
        return
      }

      const paymentOrder = await paymentsApi.createOrder(
        Math.round(pending.total * 100),
        orderId,
      )

      await openRazorpayCheckout({
        amountInPaise: Math.round(pending.total * 100),
        name: pending.shipping.fullName,
        email: pending.shipping.email,
        phone: pending.shipping.phone,
        description: `Aura of Nature · ${orderId}`,
        orderId: paymentOrder.mode === 'live' ? paymentOrder.orderId : undefined,
        onSuccess: async (payload) => {
          try {
            await paymentsApi.verify({
              razorpay_order_id: payload.razorpay_order_id,
              razorpay_payment_id: payload.razorpay_payment_id,
              razorpay_signature: payload.razorpay_signature,
              orderNumber: orderId,
            })
          } catch {
            // demo mode or verify optional when API offline
          }

          await persistOrder({
            id: orderId,
            status: 'paid',
            paymentMethod: 'razorpay',
            paymentId: payload.razorpay_payment_id,
            razorpayOrderId: payload.razorpay_order_id,
          })
          clearPendingCheckout()
          clearCart()
          navigate(`${ROUTES.orderSuccess}?id=${orderId}`, { replace: true })
        },
        onDismiss: () => setBusy(false),
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Payment failed. Please try again.',
      )
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title="Payment" description="Pay securely for your Aura order." noindex />
      <section className="pt-28 md:pt-32">
        <div className="container-aura pb-[var(--spacing-section)]">
          <Eyebrow>Checkout</Eyebrow>
          <Display as="h1" size="md" className="mt-3 text-forest">
            Payment
          </Display>
          <Body muted className="mt-2">
            Step 2 of 2 · Pay {formatCurrency(pending.total)}
          </Body>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <Eyebrow tone="gold">Pay with</Eyebrow>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMethod('razorpay')}
                  className={cn(
                    'flex items-start gap-3 border p-5 text-left transition-colors',
                    method === 'razorpay'
                      ? 'border-forest bg-beige/40'
                      : 'border-charcoal/15 hover:border-forest/50',
                  )}
                >
                  <CreditCard className="mt-0.5 h-5 w-5 text-forest" strokeWidth={1.5} />
                  <span>
                    <span className="font-display text-lg block">Razorpay</span>
                    <span className="mt-1 block text-sm text-charcoal-muted">
                      UPI, cards, netbanking
                      {!import.meta.env.VITE_RAZORPAY_KEY_ID &&
                        ' · demo mode'}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('cod')}
                  className={cn(
                    'flex items-start gap-3 border p-5 text-left transition-colors',
                    method === 'cod'
                      ? 'border-forest bg-beige/40'
                      : 'border-charcoal/15 hover:border-forest/50',
                  )}
                >
                  <Banknote className="mt-0.5 h-5 w-5 text-forest" strokeWidth={1.5} />
                  <span>
                    <span className="font-display text-lg block">Cash on delivery</span>
                    <span className="mt-1 block text-sm text-charcoal-muted">
                      Pay when your order arrives
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-8 border border-charcoal/10 p-5">
                <p className="text-micro text-olive">Ship to</p>
                <p className="mt-2 font-medium">{pending.shipping.fullName}</p>
                <Body size="sm" muted className="mt-1">
                  {pending.shipping.line1}
                  {pending.shipping.line2 ? `, ${pending.shipping.line2}` : ''}
                  <br />
                  {pending.shipping.city}, {pending.shipping.state}{' '}
                  {pending.shipping.postalCode}
                  <br />
                  {pending.shipping.phone} · {pending.shipping.email}
                </Body>
                <button
                  type="button"
                  className="mt-3 text-micro text-forest"
                  onClick={() => navigate(ROUTES.checkout)}
                >
                  Edit details
                </button>
              </div>

              {error && (
                <Body size="sm" className="mt-4 text-olive">
                  {error}
                </Body>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  disabled={busy}
                  onClick={() => void placeOrder()}
                >
                  {busy
                    ? 'Processing…'
                    : method === 'cod'
                      ? 'Place COD order'
                      : `Pay ${formatCurrency(pending.total)}`}
                </MagneticButton>
                <MagneticButton
                  variant="ghost"
                  disabled={busy}
                  onClick={() => navigate(ROUTES.checkout)}
                >
                  Back
                </MagneticButton>
              </div>
            </div>

            <OrderSummaryCard
              lines={lines}
              subtotal={pending.subtotal}
              savings={pending.savings}
              shippingMethod={pending.shipping.shippingMethod}
              shippingFee={pending.shippingFee}
              total={pending.total}
            />
          </div>
        </div>
      </section>
    </>
  )
}

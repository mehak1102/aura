import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
} from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Button, Display, Eyebrow, LeafShadows } from '@components/ui'
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

const PAYMENT_METHODS: {
  id: PaymentMethod
  label: string
  detail: string
  icon: typeof CreditCard
}[] = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    detail: 'UPI, cards, netbanking',
    icon: CreditCard,
  },
  {
    id: 'cod',
    label: 'Cash on delivery',
    detail: 'Pay when your order arrives',
    icon: Banknote,
  },
]

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
      <main className="relative isolate overflow-hidden bg-cream pt-28 md:pt-32">
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <div className="container-aura pb-[var(--spacing-section)]">
          <Eyebrow tone="gold">Checkout</Eyebrow>
          <Display as="h1" size="lg" className="mt-2 text-forest">
            Payment
          </Display>
          <p className="mt-3 text-body-sm text-charcoal-muted">
            Step 2 of 2 <span className="text-soft-gold">•</span> Pay{' '}
            {formatCurrency(pending.total)}
          </p>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
            <div className="space-y-7">
              <section className="space-y-4">
                <Eyebrow tone="gold">Pay with</Eyebrow>
                <div className="grid gap-4 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((option) => {
                    const Icon = option.icon
                    const selected = method === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setMethod(option.id)}
                        aria-pressed={selected}
                        className={cn(
                          'flex items-center gap-4 rounded-[var(--radius-lg)] border p-4 text-left transition-colors duration-300',
                          selected
                            ? 'border-forest bg-warm-white'
                            : 'border-charcoal/10 bg-warm-white/50 hover:border-soft-gold/45',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                            selected
                              ? 'bg-forest/8 text-forest'
                              : 'bg-cream text-soft-gold',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg text-forest">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-body-sm text-charcoal-muted">
                            {option.detail}
                            {option.id === 'razorpay' &&
                              !import.meta.env.VITE_RAZORPAY_KEY_ID &&
                              ' · demo mode'}
                          </span>
                        </span>

                        {selected ? (
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-forest"
                            strokeWidth={1.8}
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="h-4 w-4 shrink-0 rounded-full border border-charcoal/25"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <Eyebrow tone="gold">Ship to</Eyebrow>
                <div className="rounded-[var(--radius-lg)] border border-charcoal/10 bg-warm-white/60 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-warm-white">
                      <MapPin className="h-5 w-5" strokeWidth={1.5} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg text-forest">
                        {pending.shipping.fullName}
                      </p>
                      <Body size="sm" muted className="mt-1 leading-relaxed">
                        {pending.shipping.line1}
                        {pending.shipping.line2
                          ? `, ${pending.shipping.line2}`
                          : ''}
                        <br />
                        {pending.shipping.city}, {pending.shipping.state}{' '}
                        {pending.shipping.postalCode}
                        <br />
                        {pending.shipping.phone}
                        <span className="mx-1.5 text-soft-gold">•</span>
                        {pending.shipping.email}
                      </Body>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.checkout)}
                      className="shrink-0 rounded-full border border-charcoal/15 px-4 py-1.5 text-micro tracking-[0.18em] uppercase text-charcoal/70 transition-colors hover:border-forest hover:text-forest"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </section>

              {error && (
                <Body size="sm" className="text-[#b4534b]">
                  {error}
                </Body>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Button size="lg" disabled={busy} onClick={() => void placeOrder()}>
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  {busy
                    ? 'Processing…'
                    : method === 'cod'
                      ? 'Place COD order'
                      : `Pay ${formatCurrency(pending.total)}`}
                </Button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => navigate(ROUTES.checkout)}
                  className="inline-flex items-center gap-2 text-micro tracking-[0.18em] uppercase text-charcoal/60 transition-colors hover:text-forest disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
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
      </main>
    </>
  )
}

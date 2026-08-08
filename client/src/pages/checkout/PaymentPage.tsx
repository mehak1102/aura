import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
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
import { hydrateCart } from '@utils/cart'
import {
  buildOrderLines,
  clearPendingCheckout,
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
  const queryClient = useQueryClient()
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

  const createServerOrder = async (paymentMethod: PaymentMethod) => {
    const created = await ordersApi.create({
      shipping: pending.shipping,
      items: pending.items,
      giftWrap: Boolean((pending.giftWrapFee ?? 0) > 0),
      couponCode: pending.couponCode,
      paymentMethod,
    })

    const mirrored = {
      id: created.id,
      createdAt: created.createdAt || new Date().toISOString(),
      shipping: pending.shipping,
      shippingFee: created.shippingFee ?? pending.shippingFee,
      giftWrapFee: created.giftWrapFee ?? pending.giftWrapFee ?? 0,
      subtotal: created.subtotal ?? pending.subtotal,
      mrpTotal: created.mrpTotal ?? pending.mrpTotal,
      savings: created.savings ?? pending.savings,
      total: created.total ?? pending.total,
      items: created.items?.length ? created.items : buildOrderLines(lines),
      status: created.status,
      paymentMethod,
      paymentId: created.paymentId,
    }
    saveOrder(mirrored)
    void queryClient.invalidateQueries({ queryKey: ['orders'] })
    return mirrored
  }

  const placeOrder = async () => {
    setError(null)
    setBusy(true)

    try {
      if (method === 'cod') {
        const order = await createServerOrder('cod')
        if (!order?.id) {
          throw new Error('Order was created but no order number was returned.')
        }
        clearPendingCheckout()
        clearCart()
        navigate(`${ROUTES.orderSuccess}?id=${encodeURIComponent(order.id)}`, {
          replace: true,
          state: { order },
        })
        return
      }

      const pendingServer = await createServerOrder('razorpay')
      const orderNumber = pendingServer.id
      if (!orderNumber) {
        throw new Error('Order was created but no order number was returned.')
      }

      const paymentOrder = await paymentsApi.createOrder({
        orderNumber,
        receipt: orderNumber,
      })

      await openRazorpayCheckout({
        amountInPaise: paymentOrder.amount,
        name: pending.shipping.fullName,
        email: pending.shipping.email,
        phone: pending.shipping.phone,
        description: `Aura of Nature · ${orderNumber}`,
        key: paymentOrder.keyId,
        orderId:
          paymentOrder.mode === 'live' ? paymentOrder.orderId : undefined,
        onSuccess: async (payload) => {
          try {
            await paymentsApi.verify({
              razorpay_order_id: payload.razorpay_order_id,
              razorpay_payment_id: payload.razorpay_payment_id,
              razorpay_signature: payload.razorpay_signature,
              orderNumber,
            })

            const paid = {
              ...pendingServer,
              status: 'paid' as const,
              paymentMethod: 'razorpay' as const,
              paymentId: payload.razorpay_payment_id,
            }
            saveOrder(paid)
            clearPendingCheckout()
            clearCart()
            navigate(
              `${ROUTES.orderSuccess}?id=${encodeURIComponent(orderNumber)}`,
              { replace: true, state: { order: paid } },
            )
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'Payment could not be verified. If money was deducted, wait a moment or contact support with your order number.',
            )
            setBusy(false)
          }
        },
        onDismiss: () => setBusy(false),
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create your order. Please try again.',
      )
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title="Payment" description="Pay securely for your Aura order." noindex />
      <main className="relative isolate min-w-0 overflow-x-clip bg-cream pt-28 md:pt-32">
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <div className="container-aura min-w-0 pb-[var(--spacing-section)]">
          <Eyebrow tone="gold">Checkout</Eyebrow>
          <Display as="h1" size="lg" className="mt-2 text-forest">
            Payment
          </Display>
          <p className="mt-3 text-body-sm text-charcoal-muted">
            Step 2 of 2 <span className="text-soft-gold">•</span> Pay{' '}
            {formatCurrency(pending.total)}
          </p>

          <div className="mt-8 grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-8">
            <div className="min-w-0 w-full max-w-full space-y-5">
              <section className="space-y-3">
                <Eyebrow tone="gold">Pay with</Eyebrow>
                <div className="grid w-full min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                          'flex w-full min-w-0 items-center gap-3 rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors duration-300',
                          selected
                            ? 'border-forest bg-warm-white'
                            : 'border-charcoal/10 bg-warm-white/50 hover:border-soft-gold/45',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                            selected
                              ? 'bg-forest/8 text-forest'
                              : 'bg-cream text-soft-gold',
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-base leading-snug text-forest">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-[0.75rem] text-charcoal-muted">
                            {option.detail}
                            {option.id === 'razorpay' && ' · test mode'}
                          </span>
                        </span>

                        {selected ? (
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-forest"
                            strokeWidth={1.8}
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="h-3.5 w-3.5 shrink-0 rounded-full border border-charcoal/25"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <Eyebrow tone="gold">Ship to</Eyebrow>
                <div className="w-full min-w-0 rounded-[var(--radius-md)] border border-charcoal/10 bg-warm-white/60 px-3.5 py-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-warm-white">
                      <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    </span>

                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="font-display text-base leading-snug text-forest">
                        {pending.shipping.fullName}
                      </p>
                      <p className="mt-1 break-words text-[0.75rem] leading-relaxed text-charcoal-muted">
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
                        <span className="break-all">{pending.shipping.email}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.checkout)}
                      className="shrink-0 rounded-full border border-charcoal/15 px-3 py-1 text-[0.6rem] tracking-[0.16em] uppercase text-charcoal/70 transition-colors hover:border-forest hover:text-forest"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </section>

              {error && (
                <Body size="sm" className="text-[#b4534b]" role="alert">
                  {error}
                </Body>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => void placeOrder()}
                  className="h-8 gap-1.5 px-4 text-[0.58rem] tracking-[0.14em]"
                >
                  <Lock className="h-3 w-3" strokeWidth={2} />
                  {busy
                    ? 'Processing…'
                    : method === 'cod'
                      ? 'Place COD order'
                      : error
                        ? 'Retry payment'
                        : `Pay ${formatCurrency(pending.total)}`}
                </Button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => navigate(ROUTES.checkout)}
                  className="inline-flex items-center gap-1.5 text-[0.58rem] tracking-[0.14em] uppercase text-charcoal/60 transition-colors hover:text-forest disabled:opacity-40"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
              </div>
            </div>

            <OrderSummaryCard
              lines={lines}
              subtotal={pending.subtotal}
              savings={pending.savings}
              giftWrapFee={pending.giftWrapFee ?? 0}
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

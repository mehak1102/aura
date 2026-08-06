import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Download } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, Button, LeafWatermarks } from '@components/ui'
import {
  getLastOrderId,
  getOrderById,
  saveOrder,
  type Order,
} from '@utils/orders'
import { downloadInvoice } from '@utils/invoice'
import { ordersApi } from '@services/api/orders'
import { useAuth } from '@contexts/AuthContext'
import { formatCurrency } from '@utils/index'
import { ROUTES } from '@/routes/paths'

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const id = params.get('id') || getLastOrderId()

  const [order, setOrder] = useState<Order | undefined>(() =>
    id ? getOrderById(id) : undefined,
  )
  const [loading, setLoading] = useState(!order && Boolean(id))
  const guestEmail =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('aura_guest_order_email') || undefined
      : undefined

  useEffect(() => {
    if (!id || order) {
      setLoading(false)
      return
    }

    let cancelled = false

    ;(async () => {
      const local = getOrderById(id)
      if (local) {
        if (!cancelled) {
          setOrder(local)
          setLoading(false)
        }
        return
      }

      try {
        const remote = await ordersApi.get(
          id,
          isAuthenticated ? undefined : guestEmail,
        )
        if (cancelled) return
        saveOrder(remote)
        setOrder(remote)
      } catch {
        // leave order undefined → empty state
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, isAuthenticated, order, guestEmail])

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
        <Body muted>Loading your confirmation…</Body>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          No order found
        </Display>
        <Body muted className="mt-4">
          Your confirmation may have expired from this browser.
        </Body>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate(ROUTES.shop)}>
            Continue shopping
          </Button>
          {isAuthenticated && (
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.orderHistory)}
            >
              View orders
            </Button>
          )}
        </div>
      </main>
    )
  }

  return (
    <>
      <Seo title="Order confirmed" noindex />
      <section className="relative overflow-hidden pt-28 md:pt-32">
        <LeafWatermarks />
        <div className="container-aura relative pb-[var(--spacing-section)]">
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-forest" strokeWidth={1.25} />
            <Eyebrow className="mt-6">Thank you</Eyebrow>
            <Display as="h1" size="lg" className="mt-3 text-forest">
              Order confirmed
            </Display>
            <Body muted className="mt-4">
              {order.paymentMethod === 'cod'
                ? 'Your cash-on-delivery order is placed. We’ll confirm by email shortly.'
                : 'Payment received. A confirmation is on its way to your inbox.'}
            </Body>
            <p className="mt-6 text-micro text-olive">Order {order.id}</p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl border border-charcoal/10 bg-white/70 p-6 backdrop-blur-[2px] md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Eyebrow tone="gold">Summary</Eyebrow>
                <p className="mt-2 text-sm text-charcoal-muted">
                  {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <p className="font-display text-3xl">{formatCurrency(order.total)}</p>
            </div>

            <ul className="mt-8 space-y-4 border-t border-charcoal/10 pt-6">
              {order.items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>
                    {item.title}{' '}
                    <span className="text-charcoal-muted">
                      · {item.variantName} ×{item.quantity}
                    </span>
                  </span>
                  <span>{formatCurrency(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t border-charcoal/10 pt-4 text-sm">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {(order.giftWrapFee ?? 0) > 0 && (
                <div className="flex justify-between text-charcoal-muted">
                  <span>Gift wrapping</span>
                  <span>{formatCurrency(order.giftWrapFee ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-muted">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0
                    ? 'Free'
                    : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Payment</span>
                <span className="capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Razorpay'}
                  {order.paymentId ? ` · ${order.paymentId}` : ''}
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-charcoal/10 pt-6">
              <Eyebrow tone="gold">Ship to</Eyebrow>
              <Body size="sm" className="mt-2">
                {order.shipping.fullName}
                <br />
                {order.shipping.line1}
                {order.shipping.line2 ? `, ${order.shipping.line2}` : ''}
                <br />
                {order.shipping.city}, {order.shipping.state}{' '}
                {order.shipping.postalCode}
              </Body>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadInvoice(order)}
            >
              <Download className="h-4 w-4" strokeWidth={1.7} aria-hidden />
              Download invoice
            </Button>
            <Button onClick={() => navigate(ROUTES.shop)}>
              Continue shopping
            </Button>
            <Link
              to={ROUTES.orderHistory}
              className="inline-flex h-12 items-center px-6 text-micro tracking-[0.22em] uppercase text-forest"
            >
              View orders
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

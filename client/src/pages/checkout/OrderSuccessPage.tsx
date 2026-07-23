import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import {
  getLastOrderId,
  getOrderById,
} from '@utils/orders'
import { formatCurrency } from '@utils/index'
import { ROUTES } from '@/routes/paths'

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id') || getLastOrderId()
  const order = useMemo(() => (id ? getOrderById(id) : undefined), [id])

  if (!order) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
        <Display as="h1" size="md" className="text-forest">
          No order found
        </Display>
        <Body muted className="mt-4">
          Your confirmation may have expired from this browser.
        </Body>
        <div className="mt-8">
          <MagneticButton onClick={() => navigate(ROUTES.shop)}>
            Continue shopping
          </MagneticButton>
        </div>
      </main>
    )
  }

  return (
    <>
      <Seo title="Order confirmed" noindex />
      <section className="pt-28 md:pt-32">
        <div className="container-aura pb-[var(--spacing-section)]">
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

          <div className="mx-auto mt-14 max-w-2xl border border-charcoal/10 p-6 md:p-8">
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
            <MagneticButton onClick={() => navigate(ROUTES.shop)}>
              Continue shopping
            </MagneticButton>
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

import { ShieldCheck, ShoppingBag } from 'lucide-react'
import type { CartLine } from '@utils/cart'
import { formatCurrency } from '@utils/index'
import { Eyebrow, ProductImage } from '@components/ui'
import { SHIPPING_OPTIONS, type ShippingMethod } from '@/lib/checkoutSchemas'

type OrderSummaryProps = {
  lines: CartLine[]
  subtotal: number
  savings: number
  discount?: number
  promoCode?: string
  shippingMethod: ShippingMethod
  shippingFee: number
  total: number
}

export function OrderSummaryCard({
  lines,
  subtotal,
  savings,
  discount = 0,
  promoCode,
  shippingMethod,
  shippingFee,
  total,
}: OrderSummaryProps) {
  const methodLabel =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.label ?? 'Standard'

  return (
    <aside className="h-fit rounded-[var(--radius-lg)] border border-charcoal/8 bg-warm-white/85 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm lg:sticky lg:top-28 lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <Eyebrow tone="gold">Order summary</Eyebrow>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-forest">
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>

      <ul className="mt-6 space-y-5">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.variantId}`} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#ebe4d6]">
              <ProductImage
                src={line.product.images[0]?.url ?? ''}
                alt=""
                size="full"
                className="!bg-transparent absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm leading-snug text-forest">
                {line.product.title}
              </p>
              <p className="mt-1 text-[0.72rem] text-charcoal/55">
                {line.variant.name} <span className="mx-1">×</span>
                {line.quantity}
              </p>
            </div>
            <p className="shrink-0 text-body-sm text-forest">
              {formatCurrency(line.lineTotal)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2.5 border-t border-charcoal/8 pt-5 text-body-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-muted">Subtotal</span>
          <span className="text-charcoal">{formatCurrency(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-olive">
            <span>Savings</span>
            <span>−{formatCurrency(savings)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-olive">
            <span>Promo {promoCode ? `(${promoCode})` : ''}</span>
            <span>−{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-charcoal-muted">Shipping ({methodLabel})</span>
          <span
            className={
              shippingFee === 0
                ? 'text-micro text-olive'
                : 'text-charcoal'
            }
          >
            {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-soft-gold/25 pt-5">
        <div>
          <p className="font-display text-xl text-forest">Total</p>
          <p className="mt-0.5 text-[0.72rem] text-charcoal/50">
            (Taxes included)
          </p>
        </div>
        <p className="font-display text-2xl text-forest">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-[var(--radius-md)] bg-cream/70 px-4 py-3.5">
        <ShieldCheck className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
        <div>
          <p className="text-body-sm text-forest">Secure checkout</p>
          <p className="mt-0.5 text-[0.72rem] text-charcoal/55">
            Your information is safe with us.
          </p>
        </div>
      </div>
    </aside>
  )
}

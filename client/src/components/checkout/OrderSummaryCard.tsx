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
  giftWrapFee?: number
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
  giftWrapFee = 0,
  shippingMethod,
  shippingFee,
  total,
}: OrderSummaryProps) {
  const methodLabel =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.label ?? 'Standard'

  return (
    <aside className="h-fit w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-md)] border border-charcoal/8 bg-warm-white/85 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-5 lg:sticky lg:top-28">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <Eyebrow tone="gold">Order summary</Eyebrow>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/80 text-forest">
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.variantId}`} className="flex min-w-0 gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#ebe4d6]">
              <ProductImage
                src={line.product.images[0]?.url ?? ''}
                alt=""
                size="full"
                className="!bg-transparent absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-[0.8rem] leading-snug text-forest">
                {line.product.title}
              </p>
              <p className="mt-0.5 text-[0.68rem] text-charcoal/55">
                {line.variant.name} <span className="mx-1">×</span>
                {line.quantity}
              </p>
            </div>
            <p className="shrink-0 text-[0.8rem] tabular-nums text-forest">
              {formatCurrency(line.lineTotal)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1.5 border-t border-charcoal/8 pt-3.5 text-[0.8rem]">
        <div className="flex min-w-0 justify-between gap-3">
          <span className="min-w-0 text-charcoal-muted">Subtotal</span>
          <span className="shrink-0 tabular-nums text-charcoal">
            {formatCurrency(subtotal)}
          </span>
        </div>
        {savings > 0 && (
          <div className="flex min-w-0 justify-between gap-3 text-olive">
            <span className="min-w-0">Savings</span>
            <span className="shrink-0 tabular-nums">−{formatCurrency(savings)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex min-w-0 justify-between gap-3 text-olive">
            <span className="min-w-0">Promo {promoCode ? `(${promoCode})` : ''}</span>
            <span className="shrink-0 tabular-nums">−{formatCurrency(discount)}</span>
          </div>
        )}
        {giftWrapFee > 0 && (
          <div className="flex min-w-0 justify-between gap-3">
            <span className="min-w-0 text-charcoal-muted">Gift wrapping</span>
            <span className="shrink-0 tabular-nums text-charcoal">
              {formatCurrency(giftWrapFee)}
            </span>
          </div>
        )}
        <div className="flex min-w-0 justify-between gap-3">
          <span className="min-w-0 text-charcoal-muted">Shipping ({methodLabel})</span>
          <span
            className={
              shippingFee === 0
                ? 'shrink-0 text-[0.68rem] text-olive'
                : 'shrink-0 tabular-nums text-charcoal'
            }
          >
            {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex min-w-0 items-end justify-between gap-3 border-t border-soft-gold/25 pt-3.5">
        <div className="min-w-0">
          <p className="font-display text-lg text-forest">Total</p>
          <p className="mt-0.5 text-[0.68rem] text-charcoal/50">
            (Taxes included)
          </p>
        </div>
        <p className="shrink-0 font-display text-xl tabular-nums text-forest">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="mt-3.5 flex min-w-0 items-center gap-2.5 rounded-[var(--radius-md)] bg-cream/70 px-3 py-2.5">
        <ShieldCheck className="h-4 w-4 shrink-0 text-olive" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-[0.8rem] text-forest">Secure checkout</p>
          <p className="mt-0.5 text-[0.68rem] text-charcoal/55">
            Your information is safe with us.
          </p>
        </div>
      </div>
    </aside>
  )
}

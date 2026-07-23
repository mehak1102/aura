import type { CartLine } from '@utils/cart'
import { formatCurrency } from '@utils/index'
import { Body, Eyebrow } from '@components/ui'
import { SHIPPING_OPTIONS, type ShippingMethod } from '@/lib/checkoutSchemas'

type OrderSummaryProps = {
  lines: CartLine[]
  subtotal: number
  savings: number
  shippingMethod: ShippingMethod
  shippingFee: number
  total: number
}

export function OrderSummaryCard({
  lines,
  subtotal,
  savings,
  shippingMethod,
  shippingFee,
  total,
}: OrderSummaryProps) {
  const methodLabel =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.label ?? 'Standard'

  return (
    <aside className="h-fit border border-charcoal/10 bg-warm-white/70 p-6 backdrop-blur-sm lg:sticky lg:top-28">
      <Eyebrow tone="gold">Order summary</Eyebrow>

      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.variantId}`}
            className="flex gap-3"
          >
            <div className="h-16 w-14 shrink-0 overflow-hidden bg-beige">
              <img
                src={line.product.images[0]?.url}
                alt=""
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{line.product.title}</p>
              <p className="text-micro text-charcoal-muted">
                {line.variant.name} · ×{line.quantity}
              </p>
            </div>
            <p className="text-sm">{formatCurrency(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 border-t border-charcoal/10 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-muted">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-olive">
            <span>Savings</span>
            <span>−{formatCurrency(savings)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-charcoal-muted">Shipping ({methodLabel})</span>
          <span>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
        </div>
        <div className="flex justify-between border-t border-charcoal/10 pt-3 text-base">
          <span className="font-medium">Total</span>
          <span className="font-display text-2xl">{formatCurrency(total)}</span>
        </div>
      </div>

      <Body size="sm" muted className="mt-4">
        Taxes included where applicable. Secure checkout.
      </Body>
    </aside>
  )
}

import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, Card, Badge, Button } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency, formatDate } from '@utils/index'
import { ADMIN_ROUTES } from '@/routes/paths'

const STATUSES = [
  'pending',
  'paid',
  'cod_placed',
  'processing',
  'shipped',
  'delivered',
  'failed',
  'cancelled',
]

export default function OrderDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminApi.order(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: (status: string) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-order', id] })
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading order…</div>
  }

  if (error || !order) {
    return (
      <div>
        <p className="text-sm text-red-600">Order not found.</p>
        <Link
          to={ADMIN_ROUTES.orders}
          className="mt-4 inline-block text-sm text-forest underline"
        >
          Back to orders
        </Link>
      </div>
    )
  }

  const ship = order.shipping

  return (
    <div>
      <PageHeader
        title={order.id}
        description={`Placed ${formatDate(order.createdAt)}`}
        action={
          <Link to={ADMIN_ROUTES.orders}>
            <Button type="button" variant="outline">
              All orders
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-display text-xl text-forest">Items</h2>
          <ul className="mt-4 divide-y divide-charcoal/10">
            {(order.items || []).map((item, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-forest">{item.title}</p>
                  <p className="text-xs text-charcoal/55">
                    {item.variantName} · qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm">
                  {formatCurrency(item.lineTotal ?? 0)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display text-xl text-forest">Status</h2>
            <div className="mt-3 flex items-center gap-3">
              <Badge>{order.status.replace('_', ' ')}</Badge>
              <Badge tone="default">{order.paymentMethod || '—'}</Badge>
            </div>
            <select
              value={order.status}
              onChange={(e) => mutation.mutate(e.target.value)}
              className="mt-4 w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            {order.paymentId && (
              <p className="mt-3 text-xs text-charcoal/55">
                Payment ID: {order.paymentId}
              </p>
            )}
            {order.couponCode && (
              <p className="mt-1 text-xs text-charcoal/55">
                Coupon: {order.couponCode}
              </p>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-xl text-forest">Totals</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd>{formatCurrency(order.subtotal ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Discount</dt>
                <dd>-{formatCurrency(order.discount ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Shipping</dt>
                <dd>{formatCurrency(order.shippingFee ?? 0)}</dd>
              </div>
              <div className="flex justify-between font-medium text-forest">
                <dt>Total</dt>
                <dd>{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="font-display text-xl text-forest">Shipping</h2>
            <div className="mt-3 space-y-1 text-sm text-charcoal/80">
              <p className="font-medium text-forest">{ship?.fullName}</p>
              <p>{ship?.email}</p>
              <p>{ship?.phone}</p>
              <p className="pt-2">
                {[ship?.line1, ship?.line2].filter(Boolean).join(', ')}
              </p>
              <p>
                {[ship?.city, ship?.state, ship?.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{ship?.country}</p>
              {ship?.notes && (
                <p className="pt-2 text-charcoal/55">Note: {ship.notes}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

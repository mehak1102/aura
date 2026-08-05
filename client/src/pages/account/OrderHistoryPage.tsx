import { useQuery } from '@tanstack/react-query'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, Button } from '@components/ui'
import { AccountShell } from '@components/account/AccountShell'
import { loadOrders } from '@utils/orders'
import { ordersApi } from '@services/api/orders'
import { useAuth } from '@contexts/AuthContext'
import { formatCurrency } from '@utils/index'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        return await ordersApi.list()
      } catch {
        return loadOrders()
      }
    },
    enabled: isAuthenticated,
    initialData: () => (isAuthenticated ? undefined : loadOrders()),
  })

  const displayOrders = isAuthenticated ? orders : loadOrders()

  return (
    <>
      <Seo title="Order history" noindex />
      <AccountShell>
        <Eyebrow>Orders</Eyebrow>
        <Display as="h1" size="md" className="mt-3 text-forest">
          Order history
        </Display>
        <Body muted className="mt-3">
          {isAuthenticated
            ? 'Orders synced to your account.'
            : 'Sign in to sync orders across devices.'}
        </Body>

        {!displayOrders.length ? (
          <div className="mt-16 text-center">
            <Body muted>No orders yet.</Body>
            <div className="mt-6">
              <Button onClick={() => navigate(ROUTES.shop)}>
                Start shopping
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {displayOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 border border-charcoal/10 p-5"
              >
                <div>
                  <p className="font-display text-xl">{order.id}</p>
                  <p className="mt-1 text-sm text-charcoal-muted">
                    {new Date(order.createdAt).toLocaleString('en-IN')} ·{' '}
                    <span className="capitalize">
                      {order.status.replace('_', ' ')}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">
                    {order.items.length} item
                    {order.items.length === 1 ? '' : 's'} ·{' '}
                    {formatCurrency(order.total)}
                  </p>
                </div>
                <Link
                  to={`${ROUTES.orderSuccess}?id=${order.id}`}
                  className="text-micro text-forest"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AccountShell>
    </>
  )
}

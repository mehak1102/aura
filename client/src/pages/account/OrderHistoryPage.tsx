import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, Button } from '@components/ui'
import { AccountShell } from '@components/account/AccountShell'
import { loadOrders, mergeOrders, saveOrder } from '@utils/orders'
import { downloadInvoice } from '@utils/invoice'
import { ordersApi } from '@services/api/orders'
import { useAuth } from '@contexts/AuthContext'
import { formatCurrency } from '@utils/index'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { data: displayOrders = loadOrders() } = useQuery({
    queryKey: ['orders', isAuthenticated],
    queryFn: async () => {
      const local = loadOrders()
      if (!isAuthenticated) return local
      try {
        const remote = await ordersApi.list()
        for (const order of remote) {
          if (!getLocalHas(order.id, local)) saveOrder(order)
        }
        return mergeOrders(remote, loadOrders())
      } catch {
        return local
      }
    },
    initialData: () => loadOrders(),
  })

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
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => downloadInvoice(order)}
                    className="inline-flex items-center gap-1.5 text-micro tracking-[0.14em] uppercase text-[#b8975c] transition-colors hover:text-forest"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
                    Invoice
                  </button>
                  <Link
                    to={`${ROUTES.orderSuccess}?id=${order.id}`}
                    className="text-micro tracking-[0.14em] uppercase text-forest"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountShell>
    </>
  )
}

function getLocalHas(id: string, local: ReturnType<typeof loadOrders>) {
  return local.some((o) => o.id === id)
}

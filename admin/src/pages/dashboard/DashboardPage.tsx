import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PageHeader, StatCard, Card, Badge, DataTable } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency, formatDate } from '@utils/index'
import type { AdminOrder } from '@/types'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
  })

  if (isLoading || !data) {
    return <div className="text-sm text-charcoal/60">Loading dashboard…</div>
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of orders, revenue, and catalog health."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} />
        <StatCard label="Orders" value={data.totalOrders} />
        <StatCard label="Customers" value={data.totalUsers} />
        <StatCard
          label="Low stock"
          value={data.lowStock}
          hint={`${data.totalProducts} active products`}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-xl text-forest">7-day sales</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2f3d2e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-xl text-forest">Order status</h2>
          <ul className="mt-4 space-y-3">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <li
                key={status}
                className="flex items-center justify-between border-b border-charcoal/5 pb-2 text-sm"
              >
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <Badge>{count}</Badge>
              </li>
            ))}
            {!Object.keys(data.statusCounts).length && (
              <li className="text-sm text-charcoal/55">No orders yet</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-forest">Recent orders</h2>
        <DataTable<AdminOrder>
          rows={data.recentOrders}
          getRowKey={(row) => row.id}
          emptyMessage="No recent orders."
          columns={[
            { key: 'id', header: 'Order' },
            {
              key: 'createdAt',
              header: 'Date',
              render: (row) => formatDate(row.createdAt),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge tone={row.status === 'paid' ? 'success' : 'default'}>
                  {row.status.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'total',
              header: 'Total',
              render: (row) => formatCurrency(row.total),
            },
          ]}
        />
      </div>
    </div>
  )
}

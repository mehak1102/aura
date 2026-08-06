import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { PageHeader, Card, StatCard } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency } from '@utils/index'

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
  })

  if (isLoading || !data) {
    return <div className="text-sm text-charcoal/60">Loading analytics…</div>
  }

  const statusRows = Object.entries(data.statusCounts || {}).map(
    ([status, count]) => ({ status, count }),
  )

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Sales velocity and operational metrics."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} />
        <StatCard label="Orders" value={data.totalOrders} />
        <StatCard label="Pending" value={data.pendingOrders} />
        <StatCard label="Customers" value={data.totalUsers} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-forest">Orders by day</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#5c6b4a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-xl text-forest">Revenue by day</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value) || 0)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b7355"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-xl text-forest">Orders by status</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6b7c5a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Sales velocity and operational metrics."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} />
        <StatCard label="Orders" value={data.totalOrders} />
        <StatCard label="Pending" value={data.pendingOrders} />
      </div>

      <Card className="mt-8">
        <h2 className="font-display text-xl text-forest">Orders by day</h2>
        <div className="mt-4 h-80">
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
    </div>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency, formatDate } from '@utils/index'
import type { AdminOrder } from '@/types'

const STATUSES = ['pending', 'paid', 'cod_placed', 'failed', 'cancelled']

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminApi.orders(),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })

  if (isLoading) return <div className="text-sm text-charcoal/60">Loading orders…</div>

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Review and update order fulfillment status."
      />

      <DataTable<AdminOrder>
        rows={orders}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'id', header: 'Order' },
          {
            key: 'customer',
            header: 'Customer',
            render: (row) => row.shipping?.fullName || '—',
          },
          {
            key: 'createdAt',
            header: 'Placed',
            render: (row) => formatDate(row.createdAt),
          },
          {
            key: 'items',
            header: 'Items',
            render: (row) => row.items?.length ?? 0,
          },
          {
            key: 'total',
            header: 'Total',
            render: (row) => formatCurrency(row.total),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <select
                value={row.status}
                onChange={(e) =>
                  mutation.mutate({ id: row.id, status: e.target.value })
                }
                className="rounded-md border border-charcoal/15 bg-white px-2 py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: 'payment',
            header: 'Payment',
            render: (row) => (
              <Badge tone={row.status === 'paid' ? 'success' : 'default'}>
                {row.paymentMethod || '—'}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  )
}

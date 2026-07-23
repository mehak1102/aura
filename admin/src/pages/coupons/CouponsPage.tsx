import { useQuery } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency } from '@utils/index'
import type { AdminCoupon } from '@/types'

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminApi.coupons(),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading coupons…</div>
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Promotional codes, usage limits, and campaign performance."
      />

      <DataTable<AdminCoupon>
        rows={coupons}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'description', header: 'Description' },
          {
            key: 'discount',
            header: 'Discount',
            render: (row) =>
              row.discountType === 'flat'
                ? formatCurrency(row.discountValue)
                : `${row.discountValue}%`,
          },
          {
            key: 'minOrder',
            header: 'Min order',
            render: (row) => formatCurrency(row.minOrder),
          },
          {
            key: 'usedCount',
            header: 'Used',
            render: (row) =>
              row.usageLimit
                ? `${row.usedCount} / ${row.usageLimit}`
                : row.usedCount,
          },
          {
            key: 'isActive',
            header: 'Status',
            render: (row) => (
              <Badge tone={row.isActive ? 'success' : 'danger'}>
                {row.isActive ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  )
}

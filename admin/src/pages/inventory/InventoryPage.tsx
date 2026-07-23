import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, StatCard, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import type { AdminProduct } from '@/types'

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => adminApi.inventory(),
  })

  const mutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      adminApi.updateProduct(id, { stock }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  if (isLoading || !data) {
    return <div className="text-sm text-charcoal/60">Loading inventory…</div>
  }

  const { items, summary } = data
  const lowStockItems = items.filter((p) => p.stock < summary.threshold)

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels, alerts, and warehouse adjustments."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total SKUs" value={summary.totalSkus} />
        <StatCard
          label="Low stock"
          value={summary.lowStock}
          hint={`Below ${summary.threshold} units`}
        />
        <StatCard label="Out of stock" value={summary.outOfStock} />
        <StatCard
          label="Healthy"
          value={summary.totalSkus - summary.lowStock}
        />
      </div>

      {lowStockItems.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-xl text-forest">
            Needs attention
          </h2>
          <DataTable<AdminProduct>
            rows={lowStockItems}
            getRowKey={(row) => row.id}
            columns={[
              { key: 'title', header: 'Product' },
              {
                key: 'stock',
                header: 'Stock',
                render: (row) => (
                  <Badge tone={row.stock === 0 ? 'danger' : 'warning'}>
                    {row.stock}
                  </Badge>
                ),
              },
              {
                key: 'adjust',
                header: 'Adjust',
                render: (row) => (
                  <input
                    type="number"
                    defaultValue={row.stock}
                    className="w-20 rounded border border-charcoal/15 px-2 py-1 text-xs"
                    onBlur={(e) => {
                      const stock = Number(e.target.value)
                      if (stock !== row.stock) {
                        mutation.mutate({ id: row.id, stock })
                      }
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-forest">All SKUs</h2>
        <DataTable<AdminProduct>
          rows={items}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'title', header: 'Product' },
            {
              key: 'category',
              header: 'Category',
              render: (row) => row.category.replace(/-/g, ' '),
            },
            {
              key: 'stock',
              header: 'Stock',
              render: (row) => row.stock,
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => {
                if (row.stock === 0) return <Badge tone="danger">Out</Badge>
                if (row.stock < summary.threshold)
                  return <Badge tone="warning">Low</Badge>
                return <Badge tone="success">OK</Badge>
              },
            },
          ]}
        />
      </div>
    </div>
  )
}

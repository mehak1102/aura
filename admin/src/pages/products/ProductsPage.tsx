import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency } from '@utils/index'
import type { AdminProduct } from '@/types'

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.products(),
  })

  const mutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminProduct> }) =>
      adminApi.updateProduct(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading products…</div>
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Catalog overview with stock and merchandising flags."
      />

      <DataTable<AdminProduct>
        rows={products}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'title', header: 'Product' },
          {
            key: 'category',
            header: 'Category',
            render: (row) => row.category.replace(/-/g, ' '),
          },
          {
            key: 'price',
            header: 'Price',
            render: (row) =>
              formatCurrency(Math.round(row.mrp * (1 - row.discountPercent / 100))),
          },
          {
            key: 'stock',
            header: 'Stock',
            render: (row) => (
              <input
                type="number"
                defaultValue={row.stock}
                className="w-20 rounded border border-charcoal/15 px-2 py-1 text-xs"
                onBlur={(e) => {
                  const stock = Number(e.target.value)
                  if (stock !== row.stock) {
                    mutation.mutate({ id: row.id, patch: { stock } })
                  }
                }}
              />
            ),
          },
          {
            key: 'flags',
            header: 'Flags',
            render: (row) => (
              <div className="flex flex-wrap gap-1">
                {row.isBestSeller && <Badge tone="success">Best</Badge>}
                {row.isNewArrival && <Badge tone="warning">New</Badge>}
                {!row.isActive && <Badge tone="danger">Inactive</Badge>}
              </div>
            ),
          },
          {
            key: 'ratingAverage',
            header: 'Rating',
            render: (row) => row.ratingAverage.toFixed(1),
          },
        ]}
      />
    </div>
  )
}

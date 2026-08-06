import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge, Button } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatCurrency } from '@utils/index'
import { ADMIN_ROUTES } from '@/routes/paths'
import type { AdminProduct } from '@/types'

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.products(),
  })

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminProduct> }) =>
      adminApi.updateProduct(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory'] })
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
        action={
          <Link to={ADMIN_ROUTES.productCreate}>
            <Button type="button">Add product</Button>
          </Link>
        }
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
            key: 'mrp',
            header: 'MRP',
            render: (row) => (
              <span
                className={
                  row.discountPercent > 0
                    ? 'text-charcoal/45 line-through'
                    : undefined
                }
              >
                {formatCurrency(row.mrp)}
              </span>
            ),
          },
          {
            key: 'discount',
            header: 'Discount',
            render: (row) => (
              <input
                type="number"
                min={0}
                max={90}
                defaultValue={row.discountPercent}
                className="w-16 rounded border border-charcoal/15 px-2 py-1 text-xs"
                onBlur={(e) => {
                  const discountPercent = Math.min(
                    90,
                    Math.max(0, Number(e.target.value) || 0),
                  )
                  if (discountPercent !== row.discountPercent) {
                    patchMutation.mutate({
                      id: row.id,
                      patch: { discountPercent },
                    })
                  }
                }}
              />
            ),
          },
          {
            key: 'price',
            header: 'Sale price',
            render: (row) => {
              const sale = Math.round(
                row.mrp * (1 - (row.discountPercent || 0) / 100),
              )
              return (
                <span className="font-medium text-forest">
                  {formatCurrency(sale)}
                  {row.discountPercent > 0 && (
                    <span className="ml-1 text-[0.65rem] font-normal text-olive">
                      (−{row.discountPercent}%)
                    </span>
                  )}
                </span>
              )
            },
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
                    patchMutation.mutate({ id: row.id, patch: { stock } })
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
                <button
                  type="button"
                  onClick={() =>
                    patchMutation.mutate({
                      id: row.id,
                      patch: { isBestSeller: !row.isBestSeller },
                    })
                  }
                >
                  <Badge tone={row.isBestSeller ? 'success' : 'default'}>
                    Best
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchMutation.mutate({
                      id: row.id,
                      patch: { isNewArrival: !row.isNewArrival },
                    })
                  }
                >
                  <Badge tone={row.isNewArrival ? 'warning' : 'default'}>
                    New
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchMutation.mutate({
                      id: row.id,
                      patch: { isActive: !row.isActive },
                    })
                  }
                >
                  <Badge tone={row.isActive ? 'success' : 'danger'}>
                    {row.isActive ? 'Active' : 'Off'}
                  </Badge>
                </button>
              </div>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  to={ADMIN_ROUTES.productEdit.replace(':id', row.id)}
                  className="text-xs text-forest underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="text-xs text-red-600 underline-offset-2 hover:underline"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete “${row.title}”? This cannot be undone.`,
                      )
                    ) {
                      deleteMutation.mutate(row.id)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

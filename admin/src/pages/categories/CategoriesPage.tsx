import { useQuery } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import type { AdminCategory } from '@/types'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories(),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading categories…</div>
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Shop collections and product grouping across the catalog."
      />

      <DataTable<AdminCategory>
        rows={categories}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Category' },
          { key: 'slug', header: 'Slug' },
          {
            key: 'description',
            header: 'Description',
            className: 'max-w-md',
          },
          {
            key: 'productCount',
            header: 'Products',
            render: (row) => (
              <Badge tone={row.productCount > 0 ? 'success' : 'default'}>
                {row.productCount}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  )
}

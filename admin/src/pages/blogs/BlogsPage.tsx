import { useQuery } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import type { AdminBlog } from '@/types'

const STOREFRONT_URL =
  import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'

export default function BlogsPage() {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => adminApi.blogs(),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading blog posts…</div>
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Journal articles synced with the storefront blog."
      />

      <DataTable<AdminBlog>
        rows={blogs}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'title', header: 'Title', className: 'max-w-sm' },
          { key: 'category', header: 'Category' },
          { key: 'author', header: 'Author' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <Badge tone={row.status === 'published' ? 'success' : 'warning'}>
                {row.status}
              </Badge>
            ),
          },
          {
            key: 'publishedAt',
            header: 'Published',
            render: (row) =>
              row.publishedAt
                ? new Date(row.publishedAt).toLocaleDateString('en-IN')
                : '—',
          },
          {
            key: 'slug',
            header: 'View',
            render: (row) =>
              row.status === 'published' ? (
                <a
                  href={`${STOREFRONT_URL}/blog/${row.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-forest underline-offset-2 hover:underline"
                >
                  Open
                </a>
              ) : (
                '—'
              ),
          },
        ]}
      />
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatDate } from '@utils/index'
import type { AdminReview } from '@/types'

export default function ReviewsPage() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminApi.reviews(),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading reviews…</div>
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Customer feedback across the catalog — ratings and moderation."
      />

      <DataTable<AdminReview>
        rows={reviews}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'productTitle', header: 'Product' },
          { key: 'userName', header: 'Customer' },
          {
            key: 'rating',
            header: 'Rating',
            render: (row) => `${row.rating} / 5`,
          },
          {
            key: 'comment',
            header: 'Comment',
            className: 'max-w-sm',
            render: (row) => (
              <span className="line-clamp-2 text-charcoal/80">{row.comment}</span>
            ),
          },
          {
            key: 'verified',
            header: 'Verified',
            render: (row) =>
              row.verified ? (
                <Badge tone="success">Yes</Badge>
              ) : (
                <Badge>No</Badge>
              ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row) => formatDate(row.createdAt),
          },
        ]}
      />
    </div>
  )
}

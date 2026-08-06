import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatDate } from '@utils/index'
import type { AdminReview } from '@/types'

const STATUSES = ['pending', 'published', 'hidden']

export default function ReviewsPage() {
  const queryClient = useQueryClient()
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminApi.reviews(),
  })

  const update = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: Partial<AdminReview>
    }) => adminApi.updateReview(id, patch),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading reviews…</div>
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Moderate customer feedback — publish, hide, or delete."
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
            key: 'status',
            header: 'Status',
            render: (row) => (
              <select
                value={row.status || 'published'}
                onChange={(e) =>
                  update.mutate({ id: row.id, patch: { status: e.target.value } })
                }
                className="rounded-md border border-charcoal/15 bg-white px-2 py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: 'verified',
            header: 'Verified',
            render: (row) => (
              <button
                type="button"
                onClick={() =>
                  update.mutate({
                    id: row.id,
                    patch: { verified: !row.verified },
                  })
                }
              >
                <Badge tone={row.verified ? 'success' : 'default'}>
                  {row.verified ? 'Yes' : 'No'}
                </Badge>
              </button>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row) => formatDate(row.createdAt),
          },
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <button
                type="button"
                className="text-xs text-red-600 underline-offset-2 hover:underline"
                onClick={() => {
                  if (window.confirm('Delete this review?')) {
                    remove.mutate(row.id)
                  }
                }}
              >
                Delete
              </button>
            ),
          },
        ]}
      />
    </div>
  )
}

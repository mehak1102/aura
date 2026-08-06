import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge, Button } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatDate } from '@utils/index'

type Inquiry = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'archived'
  createdAt: string
}

export default function ContactInquiriesPage() {
  const queryClient = useQueryClient()
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: () => adminApi.contactInquiries(),
  })

  const update = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: Inquiry['status']
    }) => adminApi.updateContactInquiry(id, status),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-contact'] }),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading inquiries…</div>
  }

  return (
    <div>
      <PageHeader
        title="Contact inquiries"
        description="Messages submitted from the storefront contact form."
      />

      {inquiries.length === 0 ? (
        <p className="mt-8 text-sm text-charcoal/60">No messages yet.</p>
      ) : (
        <DataTable<Inquiry>
          rows={inquiries}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <Badge
                  tone={
                    row.status === 'new'
                      ? 'warning'
                      : row.status === 'archived'
                        ? 'default'
                        : 'success'
                  }
                >
                  {row.status}
                </Badge>
              ),
            },
            { key: 'name', header: 'From' },
            { key: 'email', header: 'Email' },
            { key: 'subject', header: 'Subject' },
            {
              key: 'message',
              header: 'Message',
              render: (row) => (
                <span className="line-clamp-2 max-w-xs text-xs text-charcoal/70">
                  {row.message}
                </span>
              ),
            },
            {
              key: 'createdAt',
              header: 'Received',
              render: (row) => formatDate(row.createdAt),
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  {row.status === 'new' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: row.id, status: 'read' })
                      }
                    >
                      Mark read
                    </Button>
                  )}
                  {row.status !== 'archived' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: row.id, status: 'archived' })
                      }
                    >
                      Archive
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}

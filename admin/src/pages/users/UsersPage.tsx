import { useQuery } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatDate } from '@utils/index'
import type { User } from '@/types'

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.users(),
  })

  if (isLoading) return <div className="text-sm text-charcoal/60">Loading users…</div>

  return (
    <div>
      <PageHeader title="Users" description="Customer and admin accounts." />

      <DataTable<User>
        rows={users}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone', render: (row) => row.phone || '—' },
          {
            key: 'role',
            header: 'Role',
            render: (row) => (
              <Badge tone={row.role === 'admin' ? 'success' : 'default'}>
                {row.role}
              </Badge>
            ),
          },
          {
            key: 'createdAt',
            header: 'Joined',
            render: (row) => (row.createdAt ? formatDate(row.createdAt) : '—'),
          },
        ]}
      />
    </div>
  )
}

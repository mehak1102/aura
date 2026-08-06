import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, DataTable, Badge, Button } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { useAuth } from '@contexts/AuthContext'
import { formatDate } from '@utils/index'
import type { User } from '@/types'

export default function UsersPage() {
  const { user: me } = useAuth()
  const queryClient = useQueryClient()
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.users(),
  })

  const update = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: Partial<User> & { confirmPassword?: string }
    }) => adminApi.updateUser(id, patch),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading users…</div>
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage roles and block accounts from signing in."
      />

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
              <select
                value={row.role}
                disabled={row.id === me?.id || update.isPending}
                onChange={(e) => {
                  const nextRole = e.target.value as User['role']
                  if (nextRole === row.role) return

                  if (nextRole === 'admin') {
                    const ok = window.confirm(
                      `Promote ${row.email} to admin? They will get full store access.`,
                    )
                    if (!ok) {
                      e.target.value = row.role
                      return
                    }
                    const confirmPassword = window.prompt(
                      'Re-enter your admin password to confirm this promotion:',
                    )
                    if (!confirmPassword) {
                      e.target.value = row.role
                      return
                    }
                    update.mutate({
                      id: row.id,
                      patch: { role: nextRole, confirmPassword },
                    })
                    return
                  }

                  if (
                    !window.confirm(
                      `Change ${row.email} from ${row.role} to ${nextRole}?`,
                    )
                  ) {
                    e.target.value = row.role
                    return
                  }
                  update.mutate({
                    id: row.id,
                    patch: { role: nextRole },
                  })
                }}
                className="rounded-md border border-charcoal/15 bg-white px-2 py-1 text-xs"
              >
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => {
              const blocked = row.isActive === false
              return (
                <Badge tone={blocked ? 'danger' : 'success'}>
                  {blocked ? 'Blocked' : 'Active'}
                </Badge>
              )
            },
          },
          {
            key: 'actions',
            header: '',
            render: (row) => {
              const isSelf = row.id === me?.id
              const blocked = row.isActive === false
              return (
                <Button
                  type="button"
                  size="sm"
                  variant={blocked ? 'outline' : 'ghost'}
                  disabled={isSelf || update.isPending}
                  className={
                    blocked
                      ? 'text-forest'
                      : 'text-red-700 hover:bg-red-50 hover:text-red-800'
                  }
                  onClick={() => {
                    if (isSelf) return
                    const nextActive = blocked
                    const label = blocked
                      ? `Unblock ${row.email}? They will be able to sign in again.`
                      : `Block ${row.email}? They will not be able to sign in.`
                    if (!window.confirm(label)) return
                    update.mutate({
                      id: row.id,
                      patch: { isActive: nextActive },
                    })
                  }}
                >
                  {isSelf ? 'You' : blocked ? 'Unblock' : 'Block'}
                </Button>
              )
            },
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

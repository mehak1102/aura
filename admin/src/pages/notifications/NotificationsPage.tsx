import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Card, Badge } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { formatDate } from '@utils/index'
import type { AdminNotification } from '@/types'

const READ_KEY = 'aura_admin_notifications_read'

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY)
    const list = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(list)
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
}

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds())
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => adminApi.notifications(),
    refetchInterval: 60_000,
  })

  useEffect(() => {
    saveReadIds(readIds)
  }, [readIds])

  const markRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id))
  }

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)))
  }

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading notifications…</div>
  }

  const unread = notifications.filter((n) => !readIds.has(n.id))

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Low stock alerts and pending order activity."
        action={
          unread.length > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-forest underline-offset-2 hover:underline"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <NotificationRow
            key={n.id}
            notification={n}
            read={readIds.has(n.id)}
            onRead={() => markRead(n.id)}
          />
        ))}
        {!notifications.length && (
          <Card className="text-center text-sm text-charcoal/60">
            No notifications right now.
          </Card>
        )}
      </div>
    </div>
  )
}

function NotificationRow({
  notification,
  read,
  onRead,
}: {
  notification: AdminNotification
  read: boolean
  onRead: () => void
}) {
  return (
    <Card
      className={`flex items-start justify-between gap-4 ${read ? 'opacity-60' : ''}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <Badge tone={notification.type === 'inventory' ? 'warning' : 'default'}>
            {notification.type}
          </Badge>
          {!read && (
            <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden />
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-forest">
          {notification.title}
        </p>
        <p className="mt-1 text-sm text-charcoal/65">{notification.message}</p>
        <p className="mt-2 text-xs text-charcoal/45">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {!read && (
        <button
          type="button"
          onClick={onRead}
          className="shrink-0 text-xs text-forest underline-offset-2 hover:underline"
        >
          Mark read
        </button>
      )}
    </Card>
  )
}

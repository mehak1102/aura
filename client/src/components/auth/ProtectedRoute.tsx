import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ROUTES } from '@/routes/paths'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-micro text-olive">
        Loading
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from || ROUTES.account

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-micro text-olive">
        Loading
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return <Outlet />
}

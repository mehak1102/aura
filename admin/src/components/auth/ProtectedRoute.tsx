import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ADMIN_ROUTES } from '@/routes/paths'

export function ProtectedRoute() {
  const { isAuthenticated, isAdmin, isLoading, mustChangePassword } = useAuth()
  const location = useLocation()
  const onChangePassword = location.pathname === ADMIN_ROUTES.changePassword

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream text-sm text-charcoal/60">
        Loading admin…
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Navigate to={ADMIN_ROUTES.login} replace state={{ from: location.pathname }} />
    )
  }

  if (mustChangePassword && !onChangePassword) {
    return <Navigate to={ADMIN_ROUTES.changePassword} replace />
  }

  if (!mustChangePassword && onChangePassword) {
    return <Navigate to={ADMIN_ROUTES.dashboard} replace />
  }

  return <Outlet />
}

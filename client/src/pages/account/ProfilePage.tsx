import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

/** Profile editing lives on the account page for now */
export default function ProfilePage() {
  return <Navigate to={ROUTES.account} replace />
}

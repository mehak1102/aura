import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'
import { Eyebrow } from '@components/ui'

const links = [
  { label: 'Overview', to: ROUTES.account, end: true },
  { label: 'Addresses', to: ROUTES.addresses },
  { label: 'Wishlist', to: ROUTES.wishlist },
  { label: 'Orders', to: ROUTES.orderHistory },
]

export function AccountNav() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="lg:w-56 lg:shrink-0">
      <Eyebrow>Account</Eyebrow>
      <p className="font-display mt-2 text-2xl text-forest">
        {user?.name?.split(' ')[0] || 'Member'}
      </p>
      <nav className="mt-8 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'block py-2 text-sm transition-colors',
                isActive
                  ? 'text-forest'
                  : 'text-charcoal-muted hover:text-forest',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => void logout().then(() => navigate(ROUTES.home))}
          className="mt-4 block py-2 text-micro text-olive hover:text-forest"
        >
          Sign out
        </button>
      </nav>
    </aside>
  )
}

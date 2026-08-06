import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Tags,
  Ticket,
  Boxes,
  Star,
  Settings,
  Bell,
  LogOut,
  Mail,
} from 'lucide-react'
import { ADMIN_ROUTES } from '@/routes/paths'
import { useAuth } from '@contexts/AuthContext'
import { cn } from '@utils/index'

const NAV = [
  { to: ADMIN_ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ADMIN_ROUTES.orders, label: 'Orders', icon: ShoppingBag },
  { to: ADMIN_ROUTES.products, label: 'Products', icon: Package },
  { to: ADMIN_ROUTES.users, label: 'Users', icon: Users },
  { to: ADMIN_ROUTES.contact, label: 'Contact', icon: Mail },
  { to: ADMIN_ROUTES.analytics, label: 'Analytics', icon: BarChart3 },
  { to: ADMIN_ROUTES.categories, label: 'Categories', icon: Tags },
  { to: ADMIN_ROUTES.coupons, label: 'Coupons', icon: Ticket },
  { to: ADMIN_ROUTES.inventory, label: 'Inventory', icon: Boxes },
  { to: ADMIN_ROUTES.reviews, label: 'Reviews', icon: Star },
  { to: ADMIN_ROUTES.settings, label: 'Settings', icon: Settings },
  { to: ADMIN_ROUTES.notifications, label: 'Notifications', icon: Bell },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-charcoal/10 bg-white">
      <div className="border-b border-charcoal/10 px-5 py-6">
        <p className="text-xs uppercase tracking-[0.3em] text-olive">Aura</p>
        <h1 className="mt-1 font-display text-2xl text-forest">Admin</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ADMIN_ROUTES.dashboard}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-forest text-cream'
                      : 'text-charcoal/75 hover:bg-cream hover:text-forest',
                  )
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-charcoal/10 px-4 py-4">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <p className="truncate text-xs text-charcoal/55">{user?.email}</p>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-3 inline-flex items-center gap-2 text-xs text-olive hover:text-forest"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

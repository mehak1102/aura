import { NavLink, useNavigate } from 'react-router-dom'
import {
  Heart,
  Home,
  LogOut,
  MapPin,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

const links = [
  { label: 'Overview', to: ROUTES.account, icon: Home, end: true },
  { label: 'Addresses', to: ROUTES.addresses, icon: MapPin },
  { label: 'Wishlist', to: ROUTES.wishlist, icon: Heart },
  { label: 'Orders', to: ROUTES.orderHistory, icon: ShoppingBag },
]

export function AccountNav() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="lg:w-[17.5rem] lg:shrink-0">
      <div className="rounded-[1.75rem] border border-[#e7e0d1] bg-white/85 p-6 shadow-[0_18px_50px_rgba(35,69,44,0.06)] backdrop-blur-sm lg:sticky lg:top-28">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1ece0] text-forest">
            <UserRound className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[0.56rem] font-medium tracking-[0.26em] text-[#b8975c] uppercase">
              Account
            </p>
            <p className="font-display mt-0.5 truncate text-[1.3rem] leading-tight text-forest">
              {user?.name?.split(' ')[0] || 'Member'}
            </p>
          </div>
        </div>

        <span className="my-5 block h-px bg-[#e7e0d1]" aria-hidden />

        <nav className="space-y-1">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-[0.9rem] transition-colors duration-200',
                  isActive
                    ? 'bg-[#efe8da] text-forest'
                    : 'text-charcoal/60 hover:bg-[#f4efe4] hover:text-forest',
                )
              }
            >
              <Icon className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={1.6} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <span className="my-5 block h-px bg-[#e7e0d1]" aria-hidden />

        <button
          type="button"
          onClick={() => void logout().then(() => navigate(ROUTES.home))}
          className="flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-[0.9rem] text-charcoal/60 transition-colors duration-200 hover:bg-[#f4efe4] hover:text-forest"
        >
          <LogOut className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={1.6} aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  )
}

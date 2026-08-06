import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ComponentType, type ReactNode } from 'react'
import {
  Heart,
  Leaf,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { AccountShell } from '@components/account/AccountShell'
import { useAuth } from '@contexts/AuthContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useCart } from '@contexts/CartContext'
import { profileSchema, type ProfileInput } from '@/lib/authSchemas'
import { loadOrders, mergeOrders, saveOrder } from '@utils/orders'
import { ordersApi } from '@services/api/orders'
import { loadAddresses } from '@utils/addresses'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'
import { cn, formatCurrency } from '@utils/index'

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>

function ProfileRow({
  icon: Icon,
  label,
  action,
  error,
  children,
  last,
}: {
  icon: IconType
  label: string
  action?: ReactNode
  error?: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-4',
        !last && 'border-b border-[#eee7da]',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1ece0] text-forest">
        <Icon className="h-4 w-4" strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.55rem] font-medium tracking-[0.24em] text-charcoal/45 uppercase">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
        {error && <p className="mt-1 text-[0.75rem] text-[#a8543f]">{error}</p>}
      </div>
      {action}
    </div>
  )
}

export default function AccountPage() {
  const { user, updateProfile, isAuthenticated } = useAuth()
  const { count: wishCount } = useWishlist()
  const { count: cartCount } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { data: orders = loadOrders() } = useQuery({
    queryKey: ['orders', isAuthenticated],
    queryFn: async () => {
      const local = loadOrders()
      if (!isAuthenticated) return local
      try {
        const remote = await ordersApi.list()
        for (const order of remote) {
          if (!local.some((o) => o.id === order.id)) saveOrder(order)
        }
        return mergeOrders(remote, loadOrders())
      } catch {
        return local
      }
    },
    initialData: () => loadOrders(),
  })
  const addresses = loadAddresses()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    try {
      await updateProfile(values)
      navigate(ROUTES.home)
    } catch {
      setError('Could not update profile.')
    }
  })

  const cards = [
    {
      label: 'Orders',
      value: String(orders.length),
      to: ROUTES.orderHistory,
      icon: Package as IconType,
    },
    {
      label: 'Wishlist',
      value: String(wishCount),
      to: ROUTES.wishlist,
      icon: Heart as IconType,
    },
    {
      label: 'Addresses',
      value: String(addresses.length),
      to: ROUTES.addresses,
      icon: MapPin as IconType,
    },
    { label: 'Bag', value: String(cartCount), to: ROUTES.cart, icon: ShoppingBag as IconType },
  ]

  const editButton = (field: 'name' | 'phone') => (
    <button
      type="button"
      onClick={() => setFocus(field)}
      className="inline-flex shrink-0 items-center gap-1.5 text-[0.75rem] text-[#b8975c] transition-colors hover:text-forest"
    >
      <Pencil className="h-3 w-3" strokeWidth={1.7} aria-hidden />
      Edit
    </button>
  )

  const fieldClass =
    'w-full bg-transparent text-[0.95rem] text-forest outline-none placeholder:text-charcoal/30'

  return (
    <>
      <Seo title="My Account" noindex />
      <AccountShell>
        <p className="text-[0.6rem] font-medium tracking-[0.3em] text-[#b8975c] uppercase">
          Overview
        </p>
        <h1 className="font-display mt-2 flex items-center gap-3 text-[clamp(2.1rem,3.2vw,2.85rem)] leading-tight text-forest">
          Hello, {user?.name?.split(' ')[0] || 'there'}
          <Leaf className="h-6 w-6 shrink-0 text-[#c2a378]" strokeWidth={1.4} aria-hidden />
        </h1>
        <p className="mt-2.5 max-w-lg text-[0.95rem] font-light text-charcoal/60">
          Manage profile, addresses, wishlist, and orders from one calm place.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, to, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(to)}
              className="rounded-2xl border border-[#e7e0d1] bg-white/85 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c4a35a]/50 hover:shadow-[0_16px_38px_rgba(35,69,44,0.08)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ece0] text-forest">
                <Icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <p className="mt-3.5 text-[0.55rem] font-medium tracking-[0.24em] text-charcoal/45 uppercase">
                {label}
              </p>
              <p className="font-display mt-1 text-[2rem] leading-none text-forest">
                {value}
              </p>
              <span className="mt-3 block h-px w-8 bg-[#c4a35a]/70" aria-hidden />
            </button>
          ))}
        </div>

        {orders[0] && (
          <div className="mt-8 rounded-2xl border border-[#e7e0d1] bg-white/85 p-5">
            <p className="text-[0.55rem] font-medium tracking-[0.24em] text-[#b8975c] uppercase">
              Latest order
            </p>
            <p className="font-display mt-2 text-xl text-forest">{orders[0].id}</p>
            <p className="mt-1 text-sm text-charcoal-muted">
              {formatCurrency(orders[0].total)} ·{' '}
              {new Date(orders[0].createdAt).toLocaleDateString('en-IN')}
            </p>
            <button
              type="button"
              className="mt-3 text-[0.75rem] text-[#b8975c] transition-colors hover:text-forest"
              onClick={() => navigate(`${ROUTES.orderSuccess}?id=${orders[0].id}`)}
            >
              View details
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-10 max-w-2xl" noValidate>
          <p className="text-[0.6rem] font-medium tracking-[0.3em] text-[#b8975c] uppercase">
            Profile
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e0d1] bg-white/85">
            <ProfileRow
              icon={UserRound}
              label="Full name"
              action={editButton('name')}
              error={errors.name?.message}
            >
              <input
                className={fieldClass}
                aria-label="Full name"
                {...register('name')}
              />
            </ProfileRow>

            <ProfileRow icon={Mail} label="Email">
              <p className="truncate text-[0.95rem] text-charcoal/55">
                {user?.email ?? ''}
              </p>
            </ProfileRow>

            <ProfileRow
              icon={Phone}
              label="Phone"
              action={editButton('phone')}
              error={errors.phone?.message}
              last
            >
              <input
                className={fieldClass}
                aria-label="Phone"
                {...register('phone')}
              />
            </ProfileRow>
          </div>

          {error && <p className="mt-4 text-[0.85rem] text-[#a8543f]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#23452C] px-7 py-3.5 text-[0.68rem] font-medium tracking-[0.2em] text-warm-white uppercase transition-colors duration-300 hover:bg-[#2a5335] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Leaf className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </AccountShell>
    </>
  )
}

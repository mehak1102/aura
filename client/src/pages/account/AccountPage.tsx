import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  Body,
  Display,
  Eyebrow,
  Input,
  MagneticButton,
} from '@components/ui'
import { AccountShell } from '@components/account/AccountShell'
import { useAuth } from '@contexts/AuthContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useCart } from '@contexts/CartContext'
import { profileSchema, type ProfileInput } from '@/lib/authSchemas'
import { loadOrders } from '@utils/orders'
import { loadAddresses } from '@utils/addresses'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'
import { formatCurrency } from '@utils/index'

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const { count: wishCount } = useWishlist()
  const { count: cartCount } = useCart()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const orders = loadOrders()
  const addresses = loadAddresses()

  const {
    register,
    handleSubmit,
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
    setSaved(false)
    try {
      await updateProfile(values)
      setSaved(true)
    } catch {
      setError('Could not update profile.')
    }
  })

  const cards = [
    {
      label: 'Orders',
      value: String(orders.length),
      to: ROUTES.orderHistory,
    },
    {
      label: 'Wishlist',
      value: String(wishCount),
      to: ROUTES.wishlist,
    },
    {
      label: 'Addresses',
      value: String(addresses.length),
      to: ROUTES.addresses,
    },
    {
      label: 'Bag',
      value: String(cartCount),
      to: ROUTES.cart,
    },
  ]

  return (
    <>
      <Seo title="My Account" noindex />
      <AccountShell>
        <Eyebrow>Overview</Eyebrow>
        <Display as="h1" size="md" className="mt-3 text-forest">
          Hello, {user?.name?.split(' ')[0] || 'there'}
        </Display>
        <Body muted className="mt-3 max-w-lg">
          Manage profile, addresses, wishlist, and orders from one calm place.
        </Body>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.to)}
              className="border border-charcoal/10 p-5 text-left transition-colors hover:border-forest"
            >
              <p className="text-micro text-olive">{card.label}</p>
              <p className="font-display mt-2 text-3xl text-forest">{card.value}</p>
            </button>
          ))}
        </div>

        {orders[0] && (
          <div className="mt-10 border border-charcoal/10 p-5">
            <Eyebrow tone="gold">Latest order</Eyebrow>
            <p className="font-display mt-2 text-xl">{orders[0].id}</p>
            <p className="mt-1 text-sm text-charcoal-muted">
              {formatCurrency(orders[0].total)} ·{' '}
              {new Date(orders[0].createdAt).toLocaleDateString('en-IN')}
            </p>
            <button
              type="button"
              className="mt-3 text-micro text-forest"
              onClick={() =>
                navigate(`${ROUTES.orderSuccess}?id=${orders[0].id}`)
              }
            >
              View details
            </button>
          </div>
        )}

        <div className="mt-12 max-w-lg">
          <Eyebrow tone="gold">Profile</Eyebrow>
          <form onSubmit={onSubmit} className="mt-6 space-y-6" noValidate>
            <Input
              label="Full name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              value={user?.email ?? ''}
              disabled
              readOnly
            />
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register('phone')}
            />
            {saved && (
              <Body size="sm" className="text-forest">
                Profile updated.
              </Body>
            )}
            {error && (
              <Body size="sm" className="text-olive">
                {error}
              </Body>
            )}
            <MagneticButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </MagneticButton>
          </form>
        </div>
      </AccountShell>
    </>
  )
}

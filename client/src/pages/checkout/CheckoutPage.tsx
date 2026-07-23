import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Seo } from '@components/seo/Seo'
import {
  Body,
  Display,
  Eyebrow,
  Input,
  MagneticButton,
  Textarea,
} from '@components/ui'
import { OrderSummaryCard } from '@components/checkout/OrderSummaryCard'
import { useCart } from '@contexts/CartContext'
import { useAuth } from '@contexts/AuthContext'
import {
  useGsap,
  revealCommerceHeader,
  revealCommerceBlocks,
} from '@animations/gsap'
import {
  checkoutSchema,
  SHIPPING_OPTIONS,
  type CheckoutInput,
} from '@/lib/checkoutSchemas'
import {
  getShippingFee,
  savePendingCheckout,
} from '@utils/orders'
import { loadAddresses } from '@utils/addresses'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

function defaultCheckoutValues(
  user: { name?: string; email?: string; phone?: string } | null | undefined,
): CheckoutInput {
  const saved = loadAddresses().find((a) => a.isDefault) ?? loadAddresses()[0]
  return {
    fullName: saved?.fullName || user?.name || '',
    email: user?.email || '',
    phone: saved?.phone || user?.phone || '',
    line1: saved?.line1 || '',
    line2: saved?.line2 || '',
    city: saved?.city || '',
    state: saved?.state || '',
    postalCode: saved?.postalCode || '',
    country: saved?.country || 'India',
    notes: '',
    shippingMethod: 'standard',
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, count, subtotal, mrpTotal, savings, items } = useCart()
  const { user, isAuthenticated } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultCheckoutValues(user),
  })

  const shippingMethod = watch('shippingMethod')
  const shippingFee = getShippingFee(shippingMethod)
  const total = subtotal + shippingFee

  useEffect(() => {
    if (!count) navigate(ROUTES.cart, { replace: true })
  }, [count, navigate])

  useEffect(() => {
    if (user?.name) setValue('fullName', user.name)
    if (user?.email) setValue('email', user.email)
    if (user?.phone) setValue('phone', user.phone)
  }, [user, setValue])

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceHeader(scope.current)
    revealCommerceBlocks(scope.current)
  }, [count])

  const onSubmit = handleSubmit((values) => {
    savePendingCheckout({
      shipping: values,
      items,
      subtotal,
      mrpTotal,
      savings,
      shippingFee: getShippingFee(values.shippingMethod),
      total: subtotal + getShippingFee(values.shippingMethod),
    })
    navigate(ROUTES.payment)
  })

  if (!count) return null

  return (
    <>
      <Seo title="Checkout" description="Complete your Aura of Nature order." noindex />
      <section ref={scope} className="pt-28 md:pt-32">
        <div className="container-aura pb-[var(--spacing-section)]">
          <Eyebrow data-page-reveal="">Checkout</Eyebrow>
          <Display data-page-reveal="" as="h1" size="md" className="mt-3 text-forest">
            Shipping details
          </Display>
          <Body data-page-reveal="" muted className="mt-2">
            Step 1 of 2 · {count} {count === 1 ? 'item' : 'items'}
          </Body>

          {!isAuthenticated && (
            <p className="mt-4 text-sm text-charcoal-muted">
              Have an account?{' '}
              <button
                type="button"
                className="text-forest underline-offset-2 hover:underline"
                onClick={() =>
                  navigate(ROUTES.login, { state: { from: ROUTES.checkout } })
                }
              >
                Sign in
              </button>{' '}
              for faster checkout.
            </p>
          )}

          <form
            onSubmit={onSubmit}
            className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16"
            noValidate
          >
            <div className="space-y-8" data-block-reveal="">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Full name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Phone"
                  type="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address line 1"
                    error={errors.line1?.message}
                    {...register('line1')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address line 2 (optional)"
                    error={errors.line2?.message}
                    {...register('line2')}
                  />
                </div>
                <Input
                  label="City"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <Input
                  label="State"
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Input
                  label="Postal code"
                  error={errors.postalCode?.message}
                  {...register('postalCode')}
                />
                <Input
                  label="Country"
                  error={errors.country?.message}
                  {...register('country')}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Order notes (optional)"
                    error={errors.notes?.message}
                    {...register('notes')}
                  />
                </div>
              </div>

              <div>
                <Eyebrow tone="gold">Shipping method</Eyebrow>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        'cursor-pointer border p-4 transition-colors',
                        shippingMethod === opt.id
                          ? 'border-forest bg-beige/40'
                          : 'border-charcoal/15 hover:border-forest/50',
                      )}
                    >
                      <input
                        type="radio"
                        value={opt.id}
                        className="sr-only"
                        {...register('shippingMethod')}
                      />
                      <p className="font-display text-lg">{opt.label}</p>
                      <p className="mt-1 text-sm text-charcoal-muted">
                        {opt.detail}
                      </p>
                      <p className="mt-2 text-micro text-olive">
                        {opt.price === 0 ? 'Free' : `₹${opt.price}`}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton type="submit" size="lg" disabled={isSubmitting}>
                  Continue to payment
                </MagneticButton>
                <MagneticButton
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(ROUTES.cart)}
                >
                  Back to bag
                </MagneticButton>
              </div>
            </div>

            <div data-block-reveal="">
            <OrderSummaryCard
              lines={lines}
              subtotal={subtotal}
              savings={savings}
              shippingMethod={shippingMethod}
              shippingFee={shippingFee}
              total={total}
            />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

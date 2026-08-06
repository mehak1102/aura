import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CircleUser,
  Globe,
  Home,
  Leaf,
  Lock,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Seo } from '@components/seo/Seo'
import {
  Button,
  Display,
  Eyebrow,
  Input,
  LeafShadows,
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
  type ShippingMethod,
} from '@/lib/checkoutSchemas'
import { getShippingFee, savePendingCheckout } from '@utils/orders'
import { loadAddresses } from '@utils/addresses'
import { scrollToSection } from '@/lib/lenisControl'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'
import { useFreeShippingThreshold } from '@hooks/usePublicSettings'

/** Top-to-bottom order of the form, so we can jump to the first problem */
const FIELD_ORDER: (keyof CheckoutInput)[] = [
  'fullName',
  'phone',
  'email',
  'line1',
  'line2',
  'city',
  'state',
  'postalCode',
  'country',
  'notes',
]

const SHIPPING_ICONS: Record<ShippingMethod, typeof Truck> = {
  standard: Truck,
}

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

function SectionHeading({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <h2 className="flex items-center gap-2.5 text-micro tracking-[0.18em] uppercase text-forest">
      <span className="text-soft-gold">{icon}</span>
      {children}
    </h2>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const {
    lines,
    count,
    subtotal,
    mrpTotal,
    savings,
    discount,
    payable,
    promo,
    items,
    giftWrapFee,
  } = useCart()
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
    // We scroll to the field ourselves so Lenis stays in sync
    shouldFocusError: false,
  })

  const shippingMethod = watch('shippingMethod')
  const freeShippingThreshold = useFreeShippingThreshold()
  const shippingFee = getShippingFee(
    shippingMethod,
    payable,
    freeShippingThreshold,
  )
  const total = payable + giftWrapFee + shippingFee
  const errorCount = Object.keys(errors).length

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

  /** Sends the user to the first field that needs fixing and pulses it */
  const revealFirstError = (fieldErrors: FieldErrors<CheckoutInput>) => {
    const firstKey = FIELD_ORDER.find((key) => fieldErrors[key])
    if (!firstKey) return

    const field = document.querySelector<HTMLElement>(`[name="${firstKey}"]`)
    if (!field) return

    scrollToSection(field, -180)
    field.classList.remove('field-flash')
    // Reading layout restarts the animation on repeat submits
    void field.offsetWidth
    field.classList.add('field-flash')
    window.setTimeout(() => field.classList.remove('field-flash'), 1800)
    // Focus after the scroll settles, or the browser fights Lenis for it
    window.setTimeout(() => field.focus({ preventScroll: true }), 600)
  }

  const onSubmit = handleSubmit(
    (values) => {
      const fee = getShippingFee(
        values.shippingMethod,
        payable,
        freeShippingThreshold,
      )
      savePendingCheckout({
        shipping: values,
        items,
        subtotal,
        mrpTotal,
        savings: savings + discount,
        giftWrapFee,
        shippingFee: fee,
        total: payable + giftWrapFee + fee,
        couponCode: promo?.code,
      })
      navigate(ROUTES.payment)
    },
    (fieldErrors) => revealFirstError(fieldErrors),
  )

  if (!count) return null

  return (
    <>
      <Seo title="Checkout" description="Complete your Aura of Nature order." noindex />
      <main
        ref={scope}
        className="relative isolate overflow-hidden bg-cream pt-28 md:pt-32"
      >
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <div className="container-aura pb-[var(--spacing-section)]">
          <Eyebrow tone="gold" data-page-reveal="">
            Checkout
          </Eyebrow>
          <Display
            data-page-reveal=""
            as="h1"
            size="lg"
            className="mt-2 text-forest"
          >
            Shipping details
          </Display>
          <div
            data-page-reveal=""
            className="mt-3 flex items-center gap-2.5 text-body-sm text-charcoal-muted"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-soft-gold/40 text-soft-gold">
              <Sparkles className="h-3 w-3" strokeWidth={1.6} />
            </span>
            Step 1 of 2 <span className="text-soft-gold">•</span> {count}{' '}
            {count === 1 ? 'item' : 'items'}
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-10"
            noValidate
          >
            <div className="space-y-7" data-block-reveal="">
              {!isAuthenticated && (
                <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-soft-gold/30 bg-warm-white/60 px-4 py-3.5">
                  <Leaf className="h-4 w-4 shrink-0 text-soft-gold" strokeWidth={1.5} />
                  <p className="text-body-sm text-charcoal/75">
                    Have an account?{' '}
                    <button
                      type="button"
                      className="text-forest underline underline-offset-2"
                      onClick={() =>
                        navigate(ROUTES.login, {
                          state: { from: ROUTES.checkout },
                        })
                      }
                    >
                      Sign in
                    </button>{' '}
                    for faster checkout.
                  </p>
                </div>
              )}

              {errorCount > 0 && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[#b4534b]/35 bg-[#b4534b]/6 px-4 py-3.5"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#b4534b]"
                    strokeWidth={1.6}
                  />
                  <p className="text-body-sm text-charcoal/75">
                    {errorCount === 1
                      ? 'One field needs your attention — check the highlighted field below.'
                      : `${errorCount} fields need your attention — check the highlighted fields below.`}
                  </p>
                </div>
              )}

              <section className="space-y-4">
                <SectionHeading icon={<CircleUser className="h-4 w-4" strokeWidth={1.5} />}>
                  Contact information
                </SectionHeading>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    variant="boxed"
                    icon={<CircleUser className="h-4 w-4" strokeWidth={1.5} />}
                    label="Full name"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <Input
                    variant="boxed"
                    icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      variant="boxed"
                      icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
                      label="Email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeading icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}>
                  Shipping address
                </SectionHeading>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      variant="boxed"
                      icon={<Home className="h-4 w-4" strokeWidth={1.5} />}
                      label="Address line 1"
                      placeholder="House number and street name"
                      required
                      autoComplete="address-line1"
                      error={errors.line1?.message}
                      {...register('line1')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      variant="boxed"
                      icon={<Building2 className="h-4 w-4" strokeWidth={1.5} />}
                      label="Address line 2 (optional)"
                      placeholder="Apartment, suite, unit, etc."
                      autoComplete="address-line2"
                      error={errors.line2?.message}
                      {...register('line2')}
                    />
                  </div>
                  <Input
                    variant="boxed"
                    icon={<Building2 className="h-4 w-4" strokeWidth={1.5} />}
                    label="City"
                    placeholder="Enter your city"
                    required
                    autoComplete="address-level2"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    variant="boxed"
                    icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
                    label="State"
                    placeholder="Enter your state"
                    required
                    autoComplete="address-level1"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <Input
                    variant="boxed"
                    icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
                    label="Postal code"
                    placeholder="Enter postal code"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                  <Input
                    variant="boxed"
                    icon={<Globe className="h-4 w-4" strokeWidth={1.5} />}
                    label="Country"
                    required
                    autoComplete="country-name"
                    error={errors.country?.message}
                    {...register('country')}
                  />
                  <div className="sm:col-span-2">
                    <Textarea
                      variant="boxed"
                      icon={<PencilLine className="h-4 w-4" strokeWidth={1.5} />}
                      label="Order notes (optional)"
                      placeholder="Notes about your order, e.g. special delivery instructions"
                      error={errors.notes?.message}
                      {...register('notes')}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeading icon={<Truck className="h-4 w-4" strokeWidth={1.5} />}>
                  Shipping method
                </SectionHeading>

                <div className="grid gap-4 sm:grid-cols-2">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const Icon = SHIPPING_ICONS[opt.id]
                    const selected = shippingMethod === opt.id
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors duration-300',
                          selected
                            ? 'border-forest bg-warm-white'
                            : 'border-charcoal/10 bg-warm-white/50 hover:border-soft-gold/45',
                        )}
                      >
                        <input
                          type="radio"
                          value={opt.id}
                          className="sr-only"
                          {...register('shippingMethod')}
                        />
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                            selected
                              ? 'bg-forest/8 text-forest'
                              : 'bg-cream text-soft-gold',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg text-forest">
                            {opt.label}
                          </span>
                          <span className="mt-0.5 block text-body-sm text-charcoal-muted">
                            3–5 business days · Free over ₹
                            {freeShippingThreshold}
                          </span>
                          <span className="mt-1 block text-micro text-soft-gold">
                            {opt.price === 0 ? 'Free' : `₹${opt.price}`}
                          </span>
                        </span>

                        <span
                          aria-hidden
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                            selected
                              ? 'border-forest'
                              : 'border-charcoal/25',
                          )}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-forest" />
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  Continue to payment
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.cart)}
                  className="inline-flex items-center gap-2 text-micro tracking-[0.18em] uppercase text-charcoal/60 transition-colors hover:text-forest"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to bag
                </button>
              </div>
            </div>

            <div data-block-reveal="">
              <OrderSummaryCard
                lines={lines}
                subtotal={subtotal}
                savings={savings}
                discount={discount}
                promoCode={promo?.code}
                giftWrapFee={giftWrapFee}
                shippingMethod={shippingMethod}
                shippingFee={shippingFee}
                total={total}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

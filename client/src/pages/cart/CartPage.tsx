import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  Info,
  Leaf,
  Loader2,
  Lock,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import {
  Body,
  BotanicalBackdrop,
  Button,
  Display,
  Eyebrow,
  LeafShadows,
} from '@components/ui'
import { MotionReveal } from '@animations/framer'
import { useCart } from '@contexts/CartContext'
import {
  useGsap,
  revealCommerceHeader,
  revealCommerceBlocks,
} from '@animations/gsap'
import { formatCurrency } from '@utils/index'
import { GIFT_WRAP_FEE } from '@utils/cart'
import { PROMO_SUGGESTIONS } from '@/data/promos'
import { ROUTES } from '@/routes/paths'
import { CartLineItem } from '@components/cart'
import { Seo } from '@components/seo/Seo'

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Truck, label: 'Free Shipping' },
  { icon: Leaf, label: '100% Natural' },
]

export default function CartPage() {
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
    promoError,
    promoPending,
    applyPromo,
    removePromo,
    clearCart,
    giftWrap,
    giftWrapFee,
    setGiftWrap,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const total = payable + giftWrapFee

  const applyPromoCode = async (code: string) => {
    const ok = await applyPromo(code)
    if (ok) setPromoInput('')
  }

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceHeader(scope.current)
    revealCommerceBlocks(scope.current)
  }, [lines.length])

  if (!lines.length) {
    return (
      <>
        <Seo title="Cart" description="Your Aura of Nature shopping bag." noindex />
        <main className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-[var(--spacing-gutter)] pt-32 text-center">
          <BotanicalBackdrop />
          <MotionReveal>
            <Eyebrow>Bag</Eyebrow>
            <Display as="h1" size="md" className="mt-4 text-forest">
              Your bag is empty
            </Display>
            <Body muted className="mt-4 max-w-md">
              Discover botanicals for skin, body, and hair — then return here to complete your ritual.
            </Body>
            <div className="mt-10 flex justify-center">
              <Button onClick={() => navigate(ROUTES.shop)}>
                Continue shopping
              </Button>
            </div>
          </MotionReveal>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Cart" description="Review your Aura of Nature bag." noindex />
      <main
        ref={scope}
        className="relative isolate overflow-hidden bg-cream pt-28 md:pt-32"
      >
        <LeafShadows className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        <div className="container-aura pb-[var(--spacing-section)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow tone="gold" data-page-reveal="">
                Your cart
              </Eyebrow>
              <Display
                data-page-reveal=""
                as="h1"
                size="lg"
                className="mt-2 text-forest"
              >
                Your bag
              </Display>
              <Body data-page-reveal="" muted size="sm" className="mt-2">
                {count} {count === 1 ? 'item' : 'items'} in your cart
              </Body>
            </div>

            <div
              data-page-reveal=""
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                to={ROUTES.shop}
                className="inline-flex items-center gap-2 text-body-sm text-charcoal/70 transition-colors hover:text-forest"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-2 text-body-sm text-charcoal/60 transition-colors hover:text-forest"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear bag
              </button>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-8 xl:gap-10">
            <div>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <CartLineItem
                      key={`${line.productId}-${line.variantId}`}
                      line={line}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div
                data-block-reveal=""
                className="relative mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-charcoal/8 bg-warm-white/70 px-6 py-5"
              >
                <div className="relative z-[1] flex items-center gap-5">
                  <Leaf className="h-6 w-6 shrink-0 text-olive" strokeWidth={1.4} />
                  <span className="h-10 w-px bg-soft-gold/30" />
                  <div>
                    <p className="font-display text-lg text-forest">
                      Pure by Nature
                    </p>
                    <Body muted size="sm" className="mt-0.5">
                      No toxins. No shortcuts. Just honest, natural care.
                    </Body>
                  </div>
                </div>
                <Leaf
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 right-4 h-28 w-28 rotate-12 text-olive/10"
                  strokeWidth={1}
                />
              </div>
            </div>

            <aside
              data-block-reveal=""
              className="h-fit rounded-[var(--radius-md)] border border-charcoal/8 bg-warm-white/85 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-5 lg:sticky lg:top-28"
            >
              <Display as="h2" size="sm" className="text-[1.35rem] text-forest sm:text-[1.5rem]">
                Order summary
              </Display>

              <div className="mt-4 space-y-2 text-[0.8rem]">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">
                    Subtotal ({count} {count === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-charcoal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-olive">
                    <span>You save</span>
                    <span>{formatCurrency(savings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal-muted">
                  <span className="line-through">MRP total</span>
                  <span className="line-through">{formatCurrency(mrpTotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-olive">
                    <span>Promo {promo ? `(${promo.code})` : ''}</span>
                    <span>−{formatCurrency(discount)}</span>
                  </div>
                )}

                {giftWrapFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Gift wrapping</span>
                    <span className="text-charcoal">
                      {formatCurrency(giftWrapFee)}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between">
                    <span className="inline-flex items-center gap-1.5 text-charcoal-muted">
                      Shipping
                      <Info className="h-3 w-3 text-charcoal/35" />
                    </span>
                    <span className="text-charcoal">{formatCurrency(0)}</span>
                  </div>
                  <p className="mt-0.5 text-[0.68rem] text-olive">
                    Free shipping on all orders
                  </p>
                </div>
              </div>

              {promo ? (
                <div className="mt-3.5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-olive/25 bg-olive/8 px-3 py-2.5">
                  <Check className="h-3.5 w-3.5 shrink-0 text-olive" strokeWidth={2} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.8rem] text-forest">
                      {promo.code} applied
                    </span>
                    <span className="mt-0.5 block text-[0.68rem] text-charcoal/55">
                      {promo.description ?? 'Discount applied to your bag'}
                      {discount > 0 ? ` · −${formatCurrency(discount)}` : ''}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    aria-label={`Remove promo code ${promo.code}`}
                    className="shrink-0 rounded-full p-1 text-charcoal/45 transition-colors hover:text-forest"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mt-3.5">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      await applyPromoCode(promoInput)
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <div className="relative min-w-0 flex-1">
                      <Tag
                        className="pointer-events-none absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-soft-gold"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <input
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code"
                        aria-label="Promo code"
                        style={{ outline: 'none' }}
                        className="h-9 w-full rounded-full border border-charcoal/12 bg-white/70 pr-3 pl-8 text-[0.75rem] tracking-[0.08em] text-forest uppercase transition-colors placeholder:tracking-normal placeholder:normal-case placeholder:text-charcoal/40 focus:border-soft-gold/70"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoPending || !promoInput.trim()}
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-forest px-4 text-[0.6rem] font-medium tracking-[0.14em] text-warm-white uppercase transition-colors hover:bg-forest-deep disabled:opacity-50"
                    >
                      {promoPending && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Apply
                    </button>
                  </form>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PROMO_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion.code}
                        type="button"
                        disabled={promoPending}
                        onClick={() => {
                          setPromoInput(suggestion.code)
                          void applyPromoCode(suggestion.code)
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-soft-gold/50 bg-cream/60 px-2.5 py-1 text-left transition-colors hover:border-soft-gold hover:bg-cream disabled:opacity-50"
                      >
                        <span className="text-[0.62rem] font-medium tracking-[0.1em] text-forest uppercase">
                          {suggestion.code}
                        </span>
                        <span className="text-[0.62rem] text-charcoal/50">
                          {suggestion.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {promoError && (
                    <p className="mt-1.5 text-[0.68rem] text-[#b4534b]">
                      {promoError}
                    </p>
                  )}
                </div>
              )}

              <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-md)] border border-charcoal/8 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="h-3.5 w-3.5 shrink-0 accent-forest"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8rem] text-forest">
                    Add gift wrapping
                  </span>
                  <span className="mt-0.5 block text-[0.68rem] text-charcoal/55">
                    Make it extra special for someone you love.
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[0.68rem] text-charcoal/60">
                  <Gift className="h-3.5 w-3.5 text-soft-gold" strokeWidth={1.5} />
                  {formatCurrency(GIFT_WRAP_FEE)}
                </span>
              </label>

              <div className="mt-3.5 flex items-end justify-between border-t border-soft-gold/25 pt-3.5">
                <div>
                  <p className="text-[0.9rem] text-forest">Total</p>
                  <p className="mt-0.5 text-[0.68rem] text-charcoal/50">
                    Inclusive of all taxes
                  </p>
                </div>
                <p className="font-display text-xl text-forest">
                  {formatCurrency(total)}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <Button
                  fullWidth
                  size="sm"
                  onClick={() => navigate(ROUTES.checkout)}
                >
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  Checkout
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(ROUTES.shop)}
                >
                  Continue shopping
                </Button>
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-3 border-t border-charcoal/8 pt-4 min-[380px]:grid-cols-3 min-[380px]:gap-2">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-soft-gold/35 bg-cream/70 text-soft-gold">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                    <span className="text-[0.62rem] leading-tight text-charcoal/60">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}

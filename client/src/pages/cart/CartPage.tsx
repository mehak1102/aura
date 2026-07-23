import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { MotionReveal } from '@animations/framer'
import { useCart } from '@contexts/CartContext'
import {
  useGsap,
  revealCommerceHeader,
  revealCommerceBlocks,
} from '@animations/gsap'
import { formatCurrency } from '@utils/index'
import { ROUTES } from '@/routes/paths'
import { CartLineItem } from '@components/cart'
import { Seo } from '@components/seo/Seo'

export default function CartPage() {
  const navigate = useNavigate()
  const { lines, count, subtotal, mrpTotal, savings, clearCart, giftWrap, setGiftWrap } =
    useCart()

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceHeader(scope.current)
    revealCommerceBlocks(scope.current)
  }, [lines.length])

  if (!lines.length) {
    return (
      <>
        <Seo title="Cart" description="Your Aura of Nature shopping bag." noindex />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
          <MotionReveal>
            <Eyebrow>Bag</Eyebrow>
            <Display as="h1" size="md" className="mt-4 text-forest">
              Your bag is empty
            </Display>
            <Body muted className="mt-4 max-w-md">
              Discover botanicals for skin, body, and hair — then return here to complete your ritual.
            </Body>
            <div className="mt-10">
              <MagneticButton onClick={() => navigate(ROUTES.shop)}>
                Continue shopping
              </MagneticButton>
            </div>
          </MotionReveal>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Cart" description="Review your Aura of Nature bag." noindex />
      <section ref={scope} className="pt-28 md:pt-32">
        <div className="container-aura pb-[var(--spacing-section)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow data-page-reveal="">Bag</Eyebrow>
              <Display data-page-reveal="" as="h1" size="md" className="mt-3 text-forest">
                Your bag
              </Display>
              <Body data-page-reveal="" muted className="mt-2">
                {count} {count === 1 ? 'item' : 'items'}
              </Body>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-micro text-olive hover:text-forest"
            >
              Clear bag
            </button>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <CartLineItem
                    key={`${line.productId}-${line.variantId}`}
                    line={line}
                  />
                ))}
              </AnimatePresence>
            </div>

            <aside
              data-block-reveal=""
              className="h-fit border border-charcoal/10 bg-warm-white/70 p-6 backdrop-blur-sm lg:sticky lg:top-28"
            >
              <Eyebrow tone="gold">Summary</Eyebrow>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-olive">
                    <span>You save</span>
                    <span>{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-muted">
                  <span>MRP total</span>
                  <span className="line-through">{formatCurrency(mrpTotal)}</span>
                </div>
                <div className="flex justify-between border-t border-charcoal/10 pt-4 text-base">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-2xl">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-charcoal-muted">
                Shipping calculated at checkout.
              </p>

              <label className="mt-5 flex cursor-pointer items-start gap-3 border border-charcoal/10 bg-cream/80 p-4">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm text-forest">Gift wrapping</span>
                  <span className="mt-1 block text-xs font-light text-charcoal/60">
                    Botanical tissue + handwritten note (+₹99 at checkout)
                  </span>
                </span>
              </label>

              <div className="mt-8 space-y-3">
                <MagneticButton
                  fullWidth
                  size="lg"
                  onClick={() => navigate(ROUTES.checkout)}
                >
                  Checkout
                </MagneticButton>
                <MagneticButton
                  fullWidth
                  variant="outline"
                  onClick={() => navigate(ROUTES.shop)}
                >
                  Continue shopping
                </MagneticButton>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

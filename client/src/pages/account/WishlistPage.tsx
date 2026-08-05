import { useNavigate } from 'react-router-dom'
import {
  Heart,
  HeartHandshake,
  Leaf,
  Sprout,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { Body, BotanicalBackdrop, Button, Display } from '@components/ui'
import { MotionReveal } from '@animations/framer'
import { ProductCard } from '@components/shop'
import { useWishlist } from '@contexts/WishlistContext'
import {
  useGsap,
  revealCommerceHeader,
  revealCommerceBlocks,
} from '@animations/gsap'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'

const assurances: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Leaf,
    title: 'Pure & Natural',
    body: "Crafted with nature's finest ingredients",
  },
  {
    icon: HeartHandshake,
    title: 'Handmade',
    body: 'Made in small batches with care',
  },
  {
    icon: Sprout,
    title: 'Ethical & Sustainable',
    body: 'Good for you, good for the planet',
  },
  {
    icon: Heart,
    title: 'Trusted by Thousands',
    body: 'Real rituals. Real results.',
  },
]

function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 26"
      className={className ?? 'h-5 w-5 text-soft-gold'}
      fill="none"
      aria-hidden
    >
      <path
        d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
        fill="currentColor"
      />
      <path
        d="M7.2 8.5C5.4 12.2 4.6 15.2 5.2 17.6a3.4 3.4 0 0 0 6.1 1.4C10.2 16.4 9.2 12.8 7.2 8.5Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M20.8 8.5C22.6 12.2 23.4 15.2 22.8 17.6a3.4 3.4 0 0 1-6.1 1.4C17.8 16.4 18.8 12.8 20.8 8.5Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

export default function WishlistPage() {
  const navigate = useNavigate()
  const { products, count, clear, remove } = useWishlist()

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceHeader(scope.current)
    revealCommerceBlocks(scope.current)
  }, [products.length])

  if (!count) {
    return (
      <>
        <Seo
          title="Wishlist"
          description="Your saved Aura of Nature rituals."
          noindex
        />
        <main className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-[var(--spacing-gutter)] pt-32 text-center">
          <BotanicalBackdrop />
          <MotionReveal>
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-soft-gold/45 bg-[#f2ece1] text-soft-gold">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <Display as="h1" size="md" className="mt-6 text-forest">
              Nothing saved yet
            </Display>
            <Body muted className="mt-4 max-w-md">
              Tap the heart on any ritual to keep it here — then return when you
              are ready to bring it home.
            </Body>
            <div className="mt-10 flex justify-center">
              <Button onClick={() => navigate(ROUTES.shop)}>Explore shop</Button>
            </div>
          </MotionReveal>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Wishlist"
        description="Your saved Aura of Nature rituals."
        noindex
      />
      <section
        ref={scope}
        className="relative isolate overflow-hidden pt-28 md:pt-32"
      >
        <BotanicalBackdrop />

        <div className="container-aura relative pb-[var(--spacing-section)]">
          {/* ── Header ── */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <div
                data-page-reveal=""
                className="flex items-center gap-3.5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-soft-gold/45 bg-[#f2ece1] text-soft-gold">
                  <Heart className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
                </span>
                <span className="text-[0.68rem] font-medium tracking-[0.28em] text-soft-gold uppercase">
                  Wishlist
                </span>
              </div>

              <Display
                data-page-reveal=""
                as="h1"
                size="md"
                className="mt-4 text-forest"
              >
                Saved rituals
              </Display>

              <div
                data-page-reveal=""
                aria-hidden
                className="mt-4 flex max-w-sm items-center gap-3"
              >
                <span className="h-px flex-1 bg-soft-gold/50" />
                <LeafMark className="h-[1.15rem] w-[1.15rem] text-soft-gold" />
                <span className="h-px flex-1 bg-soft-gold/50" />
              </div>

              <Body data-page-reveal="" muted className="mt-5">
                Your favorite rituals, saved for you.
              </Body>
              <p
                data-page-reveal=""
                className="mt-4 text-[0.8rem] text-charcoal-muted"
              >
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </div>

            <button
              data-page-reveal=""
              type="button"
              onClick={clear}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-soft-gold/50 bg-white/60 px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase transition-colors hover:border-soft-gold hover:bg-white"
            >
              <Trash2 className="h-[0.9rem] w-[0.9rem]" strokeWidth={1.6} />
              Clear all
            </button>
          </div>

          {/* ── Saved products ── */}
          <div
            data-block-reveal=""
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={() => remove(product.id)}
              />
            ))}
          </div>

          {/* ── Assurance bar ── */}
          <ul
            data-block-reveal=""
            className="mt-16 grid gap-8 rounded-3xl border border-forest/10 bg-white/55 px-7 py-8 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
          >
            {assurances.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className={
                  i > 0
                    ? 'flex gap-4 lg:border-l lg:border-forest/10 lg:pl-7'
                    : 'flex gap-4 lg:pr-7'
                }
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-soft-gold/45 bg-[#f2ece1] text-forest">
                  <Icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.86rem] font-medium text-forest">
                    {title}
                  </p>
                  <p className="mt-1 text-[0.78rem] font-light leading-relaxed text-charcoal-muted">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

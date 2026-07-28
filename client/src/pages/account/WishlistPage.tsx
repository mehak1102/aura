import { useNavigate } from 'react-router-dom'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
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

export default function WishlistPage() {
  const navigate = useNavigate()
  const { products, count, clear } = useWishlist()

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
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
          <MotionReveal>
            <Eyebrow>Wishlist</Eyebrow>
            <Display as="h1" size="md" className="mt-4 text-forest">
              Nothing saved yet
            </Display>
            <Body muted className="mt-4 max-w-md">
              Tap the heart on any ritual to keep it here — then return when you
              are ready to bring it home.
            </Body>
            <div className="mt-10">
              <MagneticButton onClick={() => navigate(ROUTES.shop)}>
                Explore shop
              </MagneticButton>
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
      <section ref={scope} className="pt-28 md:pt-32">
        <div className="container-aura pb-[var(--spacing-section)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow data-page-reveal="">Wishlist</Eyebrow>
              <Display
                data-page-reveal=""
                as="h1"
                size="md"
                className="mt-3 text-forest"
              >
                Saved rituals
              </Display>
              <Body data-page-reveal="" muted className="mt-2">
                {count} {count === 1 ? 'item' : 'items'}
              </Body>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-micro text-olive hover:text-forest"
            >
              Clear all
            </button>
          </div>

          <div
            data-block-reveal=""
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

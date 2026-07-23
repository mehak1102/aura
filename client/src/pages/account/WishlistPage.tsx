import { useNavigate } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { AccountShell } from '@components/account/AccountShell'
import { ProductCard } from '@components/shop'
import { useWishlist } from '@contexts/WishlistContext'
import { ROUTES } from '@/routes/paths'

export default function WishlistPage() {
  const { products, count, clear } = useWishlist()
  const navigate = useNavigate()

  return (
    <>
      <Seo title="Wishlist" noindex />
      <AccountShell>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Wishlist</Eyebrow>
            <Display as="h1" size="md" className="mt-3 text-forest">
              Saved rituals
            </Display>
            <Body muted className="mt-2">
              {count} {count === 1 ? 'item' : 'items'}
            </Body>
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-micro text-olive hover:text-forest"
            >
              Clear all
            </button>
          )}
        </div>

        {!count ? (
          <div className="mt-16 text-center">
            <Body muted>Your wishlist is empty.</Body>
            <div className="mt-6">
              <MagneticButton onClick={() => navigate(ROUTES.shop)}>
                Explore shop
              </MagneticButton>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </AccountShell>
    </>
  )
}

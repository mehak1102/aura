import type { CatalogProduct } from '@/types/shop'
import { Display, Eyebrow } from '@components/ui'
import { ProductCard } from '@components/shop'

type ProductRailProps = {
  title: string
  eyebrow?: string
  products: CatalogProduct[]
}

export function ProductRail({ title, eyebrow, products }: ProductRailProps) {
  if (!products.length) return null

  return (
    <section className="section-aura-sm">
      <div className="container-aura">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Display as="h2" size="md" className="mt-3 text-forest">
          {title}
        </Display>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

import type { CatalogProduct } from '@/types/shop'
import { Display, Eyebrow } from '@components/ui'
import { ProductCard } from '@components/shop'
import { useGsap, gsap, prefersReducedMotion } from '@animations/gsap'

type ProductRailProps = {
  title: string
  eyebrow?: string
  products: CatalogProduct[]
}

export function ProductRail({ title, eyebrow, products }: ProductRailProps) {
  const scope = useGsap(() => {
    if (!scope.current || prefersReducedMotion()) return

    const cards = scope.current.querySelectorAll('[data-product-card]')
    if (!cards.length) return

    gsap.fromTo(
      cards,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 82%',
          once: true,
        },
      },
    )
  }, [products])

  if (!products.length) return null

  return (
    <section ref={scope} className="py-5 md:py-6">
      <div className="container-aura">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Display as="h2" size="md" className={`${eyebrow ? 'mt-3' : ''} text-forest`}>
          {title}
        </Display>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

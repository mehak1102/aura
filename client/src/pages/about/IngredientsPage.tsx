import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { EditorialHero } from '@components/content'
import { Body, Display, Eyebrow, LeafShadows } from '@components/ui'
import {
  ingredientsHero,
  sourcingNote,
} from '@/data/about'
import { botanicals, botanicalPath, type Botanical } from '@/data/botanicals'
import { useCatalog } from '@contexts/CatalogContext'
import { productPath } from '@/lib/seo'
import { ROUTES } from '@/routes/paths'
import type { CatalogProduct } from '@/types/shop'
import blackCuminHoverImg from '@/assets/ingredients/black-cumin-hover.png'
import coffeeHoverImg from '@/assets/ingredients/coffee-hover.png'
import cucumberSeedHoverImg from '@/assets/ingredients/cucumber-seed-hover.png'
import eucalyptusHoverImg from '@/assets/ingredients/eucalyptus-hover.png'
import jojobaHoverImg from '@/assets/ingredients/jojoba-hover.png'
import peachHoverImg from '@/assets/ingredients/peach-hover.png'
import lavenderHoverImg from '@/assets/ingredients/lavender-hover.png'
import watermelonHoverImg from '@/assets/ingredients/watermelon-hover.png'
import wildApricotHoverImg from '@/assets/ingredients/wild-apricot-hover.png'
import {
  useGsap,
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  revealCommerceBlocks,
} from '@animations/gsap'

/** Custom Ingredients-grid hover stills (slug → image). */
const INGREDIENT_HOVER_IMAGES: Partial<
  Record<string, { url: string; alt: string }>
> = {
  'black-cumin': {
    url: blackCuminHoverImg,
    alt: 'Aura of Nature Black Cumin cold-pressed oil box and bottle',
  },
  coffee: {
    url: coffeeHoverImg,
    alt: 'Aura of Nature Fresh Coffee Face Wash box and bottle',
  },
  'cucumber-seed': {
    url: cucumberSeedHoverImg,
    alt: 'Aura of Nature Cucumber Seed cold-pressed oil box and bottle',
  },
  eucalyptus: {
    url: eucalyptusHoverImg,
    alt: 'Aura of Nature Eucalyptus essential oil box',
  },
  jojoba: {
    url: jojobaHoverImg,
    alt: 'Aura of Nature Jojoba cold-pressed oil bottle',
  },
  peach: {
    url: peachHoverImg,
    alt: 'Aura of Nature Nourishing Peach Lotion box and bottle',
  },
  lavender: {
    url: lavenderHoverImg,
    alt: 'Aura of Nature Lavender essential oil box and bottle',
  },
  watermelon: {
    url: watermelonHoverImg,
    alt: 'Aura of Nature Watermelon cold-pressed oil box and bottle',
  },
  'watermelon-seed-oil': {
    url: watermelonHoverImg,
    alt: 'Aura of Nature Watermelon cold-pressed oil box and bottle',
  },
  'wild-apricot': {
    url: wildApricotHoverImg,
    alt: 'Aura of Nature Wild Apricot cold-pressed oil box and bottle',
  },
}

function BotanicalMark({ slug }: { slug: string }) {
  const common = {
    viewBox: '0 0 32 32',
    className: 'h-5 w-5 text-soft-gold',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (slug) {
    case 'coffee':
      return (
        <svg {...common}>
          <ellipse cx="16" cy="16" rx="7" ry="10" />
          <path d="M16 6c2 3 2 17 0 20" />
        </svg>
      )
    case 'charcoal':
      return (
        <svg {...common}>
          <path d="M10 22l2-12 4 4 4-6 2 14H10Z" />
          <path d="M12 24h8" />
        </svg>
      )
    case 'black-cumin':
      return (
        <svg {...common}>
          <ellipse cx="16" cy="16" rx="4" ry="7" />
          <path d="M16 9c1.5 2 1.5 12 0 14" />
        </svg>
      )
    case 'carrot-seed':
      return (
        <svg {...common}>
          <path d="M16 28V14" />
          <path d="M16 14c-4 2-7 6-7 10M16 14c4 2 7 6 7 10" />
          <path d="M12 8c1.5 2 3 3 4 3s2.5-1 4-3M10 11c2 1.5 4 2 6 2s4-.5 6-2" />
        </svg>
      )
    case 'cucumber-seed':
      return (
        <svg {...common}>
          <ellipse cx="16" cy="16" rx="6" ry="10" />
          <path d="M16 8v16M12 12h8M11 16h10M12 20h8" />
        </svg>
      )
    case 'eucalyptus':
      return (
        <svg {...common}>
          <path d="M16 28V8" />
          <path d="M16 12c-3-1-5-3-5-5M16 12c3-1 5-3 5-5" />
          <path d="M16 18c-3.5-1-6-3-6-5M16 18c3.5-1 6-3 6-5" />
          <path d="M16 24c-3-1-5-2.5-5-4M16 24c3-1 5-2.5 5-4" />
        </svg>
      )
    case 'goat-milk':
      return (
        <svg {...common}>
          <path d="M8 20c0-4 3.5-8 8-8s8 4 8 8" />
          <path d="M11 20v2M21 20v2" />
          <path d="M13 12c0-2 1.2-3.5 3-3.5S19 10 19 12" />
          <path d="M12 9l-2-2M20 9l2-2" />
        </svg>
      )
    case 'watermelon-seed-oil':
      return (
        <svg {...common}>
          <path d="M6 18c0-6 4.5-12 10-12s10 6 10 12H6Z" />
          <path d="M10 18c1-3 3.5-5 6-5s5 2 6 5" />
          <circle cx="13" cy="15" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="17" cy="14" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="20" cy="16" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'peach':
      return (
        <svg {...common}>
          <path d="M16 10c-5 0-8 4-8 9s3.5 7 8 7 8-2 8-7-3-9-8-9Z" />
          <path d="M16 10c1-3 3-4 5-4" />
          <path d="M16 10v16" />
        </svg>
      )
    case 'wild-apricot':
      return (
        <svg {...common}>
          <circle cx="13" cy="17" r="6" />
          <circle cx="19" cy="17" r="6" />
          <path d="M16 11c0-2.5 1.5-4 3.5-4" />
        </svg>
      )
    case 'tea-tree':
      return (
        <svg {...common}>
          <path d="M16 26V8" />
          <path d="M16 12c-4 1-7 4-8 8M16 12c4 1 7 4 8 8M16 18c-3 .5-5 2-6 4M16 18c3 .5 5 2 6 4" />
        </svg>
      )
    case 'lavender':
      return (
        <svg {...common}>
          <path d="M16 28V14" />
          <path d="M16 14c-3-4-6-6-8-6M16 14c3-4 6-6 8-6" />
          <path d="M16 18c-2.5-2-5-3-7-3M16 18c2.5-2 5-3 7-3" />
          <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'jojoba':
      return (
        <svg {...common}>
          <path d="M16 7c4 5 6 10 6 14a6 6 0 0 1-12 0c0-4 2-9 6-14Z" />
          <path d="M16 12v12" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M16 6c-2 4-3.5 8-3.5 11a3.5 3.5 0 0 0 7 0c0-3-1.5-7-3.5-11Z" />
          <path d="M11 11c-1.5 3-2 5.5-1.5 7.5a2.6 2.6 0 0 0 4.7 1" />
          <path d="M21 11c1.5 3 2 5.5 1.5 7.5a2.6 2.6 0 0 1-4.7 1" />
        </svg>
      )
  }
}

function IngredientCard({
  ing,
  product,
}: {
  ing: Botanical
  product?: CatalogProduct
}) {
  const productImage = product?.images[0]
  const customHover = INGREDIENT_HOVER_IMAGES[ing.slug]
  const hoverImage = customHover
    ? customHover
    : productImage
      ? {
          url: productImage.url,
          alt: productImage.alt || product?.title || ing.name,
        }
      : null

  const shopTo =
    product?.slug != null
      ? productPath(product.slug)
      : ing.productSlugs[0]
        ? productPath(ing.productSlugs[0])
        : botanicalPath(ing.slug)

  return (
    <article
      data-ingredient-card=""
      className="group flex flex-col overflow-hidden rounded-2xl bg-[#f3ebe0] shadow-[0_12px_40px_rgba(36,53,40,0.08)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative">
        <div className="relative aspect-[5/4] overflow-hidden bg-[#ebe3d6]">
          <Link
            to={botanicalPath(ing.slug)}
            className="absolute inset-0 block"
            aria-label={`View ${ing.name} ingredient`}
          >
            <img
              src={ing.image}
              alt={ing.name}
              className="h-full w-full origin-[78%_52%] scale-[1.32] object-cover object-[78%_52%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.4]"
              loading="lazy"
            />
          </Link>

          {hoverImage && (
            <Link
              to={shopTo}
              className="absolute inset-0 z-20 translate-y-[105%] overflow-hidden opacity-0 will-change-transform transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
              aria-label={`Shop ${product?.title || ing.name}`}
            >
              <img
                src={hoverImage.url}
                alt=""
                className="h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
            </Link>
          )}
        </div>

        <span className="pointer-events-none absolute bottom-0 left-5 z-30 flex h-11 w-11 translate-y-1/2 items-center justify-center rounded-full border border-soft-gold/25 bg-[#faf6ef] shadow-[0_6px_18px_rgba(36,53,40,0.1)] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0">
          <BotanicalMark slug={ing.slug} />
        </span>
      </div>

      <Link
        to={botanicalPath(ing.slug)}
        className="relative flex flex-1 flex-col px-5 pb-5 pt-9"
      >
        <Eyebrow tone="gold" className="!tracking-[0.18em]">
          {ing.latin}
        </Eyebrow>
        <Display as="h2" size="sm" className="mt-1.5 text-forest">
          {ing.name}
        </Display>
        <Body muted className="mt-2 text-[0.95rem] leading-snug">
          {ing.benefits[0]}
        </Body>
        <span
          aria-hidden
          className="mt-auto self-end pt-4 text-forest/45 transition-all duration-400 group-hover:translate-x-1 group-hover:text-forest"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </article>
  )
}

export default function IngredientsPage() {
  const { getBySlug } = useCatalog()
  const scope = useGsap(() => {
    const root = scope.current
    if (!root) return

    revealCommerceBlocks(root)

    if (prefersReducedMotion()) return

    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-ingredient-card]'),
    )
    if (!cards.length) return

    const grid =
      root.querySelector<HTMLElement>('[data-ingredient-grid]') ?? cards[0]

    gsap.set(cards, { autoAlpha: 0, y: 72, scale: 0.94 })

    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.22,
      scrollTrigger: {
        trigger: grid,
        start: 'top 86%',
        toggleActions: 'play none none none',
        once: true,
      },
    })

    ScrollTrigger.refresh()
  }, [])

  return (
    <>
      <Seo
        title="Ingredients"
        description="Discover every botanical behind Aura of Nature — charcoal, coffee, peach, jojoba, lavender, tea tree, and more."
      />
      <main ref={scope} className="relative overflow-hidden bg-[#faf6ef] pb-24">
        <LeafShadows />

        <div className="relative z-[1]">
        <EditorialHero
          eyebrow={ingredientsHero.eyebrow}
          title={ingredientsHero.title}
          description={ingredientsHero.description}
          image={ingredientsHero.image}
          imageAlt="Botanical ingredients"
          withLeafRule
          softMerge
        />

        <section className="section-aura">
          <div
            data-ingredient-grid=""
            className="container-aura grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {botanicals.map((ing) => (
              <IngredientCard
                key={ing.slug}
                ing={ing}
                product={getBySlug(ing.productSlugs[0])}
              />
            ))}
          </div>

          <div
            data-block-reveal=""
            className="container-aura mt-14 flex justify-center"
          >
            <Link
              to={ROUTES.shop}
              className="inline-flex items-center gap-3 rounded-xl border border-charcoal/18 bg-transparent px-8 py-4 text-micro tracking-[0.22em] text-forest uppercase transition-colors duration-400 hover:border-forest hover:bg-warm-white"
            >
              <svg
                viewBox="0 0 28 26"
                className="h-4 w-4 text-soft-gold"
                fill="currentColor"
                aria-hidden
              >
                <path d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z" />
              </svg>
              Explore all products
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </section>

        <section
          data-block-reveal=""
          className="section-aura border-t border-charcoal/10"
        >
          <div className="container-aura max-w-2xl">
            <Display as="h2" size="md" className="text-forest">
              {sourcingNote.title}
            </Display>
            <Body muted className="mt-5 leading-relaxed">
              {sourcingNote.body}
            </Body>
          </div>
        </section>
        </div>
      </main>
    </>
  )
}

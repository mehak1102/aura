import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Leaf, Minus, Plus, Sparkles, Trash2 } from 'lucide-react'
import type { CartLine } from '@utils/cart'
import type { ProductCategory, ProductConcern } from '@/types/shop'
import { formatCurrency } from '@utils/index'
import { ProductImage } from '@components/ui'
import { useCart } from '@contexts/CartContext'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { fadeUp, motionEase } from '@animations/framer/presets'

const CRAFT_LABELS: Record<ProductCategory, string> = {
  'cold-pressed-oils': 'Cold Pressed',
  'essential-oils': 'Steam Distilled',
  'skin-care': 'Small Batch',
  'body-care': 'Small Batch',
  'hair-care': 'Small Batch',
}

const CONCERN_LABELS: Record<ProductConcern, string> = {
  acne: 'Pore Friendly',
  dryness: 'Deep Nourish',
  dullness: 'Glow Boost',
  hairfall: 'Root Strength',
  pigmentation: 'Even Tone',
  sensitivity: 'Skin Loving',
}

type CartLineItemProps = {
  line: CartLine
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateQty, removeItem } = useCart()
  const { product, variant, quantity, lineTotal } = line
  const image = product.images[0]
  const reduced = usePrefersReducedMotion()

  const traits = [
    { icon: Leaf, label: '100% Natural' },
    { icon: Droplets, label: CRAFT_LABELS[product.category] ?? 'Small Batch' },
    {
      icon: Sparkles,
      label: product.concerns[0]
        ? CONCERN_LABELS[product.concerns[0]]
        : 'Skin Loving',
    },
  ]

  return (
    <motion.article
      layout={!reduced}
      initial={reduced ? false : fadeUp.initial}
      animate={fadeUp.animate}
      exit={reduced ? undefined : { opacity: 0, x: -12 }}
      transition={{ duration: 0.35, ease: motionEase }}
      className="grid grid-cols-[88px_1fr] gap-4 rounded-[var(--radius-lg)] border border-charcoal/8 bg-warm-white/80 p-4 shadow-[var(--shadow-soft)] transition-colors duration-500 hover:border-soft-gold/35 sm:grid-cols-[124px_1fr] sm:gap-5 sm:p-5"
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-[#ebe4d6]"
      >
        <ProductImage
          src={image?.url ?? ''}
          alt={image?.alt || product.title}
          size="full"
          className="!bg-transparent absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-micro text-soft-gold">
              {product.category.replace(/-/g, ' ')}
            </p>
            <Link
              to={`/product/${product.slug}`}
              className="mt-1 block font-display text-xl text-forest transition-colors hover:text-olive sm:text-2xl"
            >
              {product.title}
            </Link>
            <p className="mt-1 text-body-sm text-charcoal-muted">
              {variant.name}
              {variant.sku ? ` · ${variant.sku}` : ''}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-display text-xl text-forest">
              {formatCurrency(lineTotal)}
            </p>
            {variant.discountPercent > 0 && (
              <p className="text-body-sm text-charcoal-muted line-through">
                {formatCurrency(variant.mrp * quantity)}
              </p>
            )}
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {traits.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 text-[0.7rem] leading-tight text-charcoal/60"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-soft-gold" strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-soft-gold/40 bg-cream/60">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="rounded-l-full px-3 py-2 text-charcoal/70 transition-colors hover:text-forest"
              onClick={() => updateQty(product.id, variant.id, quantity - 1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-body-sm text-forest">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="rounded-r-full px-3 py-2 text-charcoal/70 transition-colors hover:text-forest"
              onClick={() =>
                updateQty(
                  product.id,
                  variant.id,
                  Math.min(variant.stock, quantity + 1),
                )
              }
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id, variant.id)}
            className="inline-flex items-center gap-1.5 text-body-sm text-charcoal/60 transition-colors hover:text-forest"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  )
}

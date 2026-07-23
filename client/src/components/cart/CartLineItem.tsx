import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartLine } from '@utils/cart'
import { formatCurrency } from '@utils/index'
import { useCart } from '@contexts/CartContext'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { fadeUp, motionEase } from '@animations/framer/presets'

type CartLineItemProps = {
  line: CartLine
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateQty, removeItem } = useCart()
  const { product, variant, quantity, lineTotal } = line
  const image = product.images[0]
  const reduced = usePrefersReducedMotion()

  return (
    <motion.article
      layout={!reduced}
      initial={reduced ? false : fadeUp.initial}
      animate={fadeUp.animate}
      exit={reduced ? undefined : { opacity: 0, x: -12 }}
      transition={{ duration: 0.35, ease: motionEase }}
      className="grid grid-cols-[96px_1fr] gap-4 border-b border-charcoal/10 py-6 md:grid-cols-[120px_1fr_auto] md:gap-6"
    >
      <Link
        to={`/product/${product.slug}`}
        className="aspect-[4/5] overflow-hidden bg-beige"
      >
        <img
          src={image?.url}
          alt={image?.alt || product.title}
          className="h-full w-full object-contain p-2"
        />
      </Link>

      <div className="min-w-0">
        <Link
          to={`/product/${product.slug}`}
          className="font-display text-xl text-charcoal transition-colors hover:text-forest"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-sm text-charcoal-muted">
          {variant.name}
          {variant.sku ? ` · ${variant.sku}` : ''}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center border border-charcoal/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="px-3 py-2 hover:bg-beige/50"
              onClick={() =>
                updateQty(product.id, variant.id, quantity - 1)
              }
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="px-3 py-2 hover:bg-beige/50"
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
            className="inline-flex items-center gap-1.5 text-micro text-olive hover:text-forest"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>

      <div className="col-span-2 flex items-start justify-between md:col-span-1 md:flex-col md:items-end md:gap-2">
        <p className="font-medium">{formatCurrency(lineTotal)}</p>
        {variant.discountPercent > 0 && (
          <p className="text-sm text-charcoal-muted line-through">
            {formatCurrency(variant.mrp * quantity)}
          </p>
        )}
      </div>
    </motion.article>
  )
}

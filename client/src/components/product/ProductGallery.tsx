import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProductMedia } from '@/types'
import { cn } from '@utils/index'
import { productImageUrl } from '@utils/productImage'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { scaleIn, motionEase } from '@animations/framer/presets'

type ProductGalleryProps = {
  images: ProductMedia[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]
  const reduced = usePrefersReducedMotion()

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige">
        <AnimatePresence mode="wait">
          {current && (
            <motion.img
              key={current.url}
              src={current.url}
              alt={current.alt || title}
              className="absolute inset-0 h-full w-full object-contain p-4"
              initial={reduced ? false : scaleIn.initial}
              animate={scaleIn.animate}
              exit={reduced ? undefined : scaleIn.exit}
              transition={{ duration: 0.45, ease: motionEase }}
            />
          )}
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'aspect-square h-16 w-16 shrink-0 overflow-hidden border transition-colors duration-300 sm:h-auto sm:w-auto sm:shrink',
                i === active
                  ? 'border-forest'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={productImageUrl(img.url, i === active ? 'full' : 'card')}
                alt=""
                className="h-full w-full object-contain p-1"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

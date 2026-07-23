import { useState, type ImgHTMLAttributes } from 'react'
import { productImageUrl } from '@utils/productImage'
import { cn } from '@utils/index'

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  size?: 'card' | 'full'
}

/**
 * Resolves card/full product paths and falls back card ↔ full on error.
 */
export function ProductImage({
  src,
  size = 'card',
  alt = '',
  className,
  ...rest
}: ProductImageProps) {
  const primary = productImageUrl(src, size)
  const fallback =
    size === 'card' ? productImageUrl(src, 'full') : productImageUrl(src, 'card')
  const [current, setCurrent] = useState(primary || fallback)
  const [failed, setFailed] = useState(!src)

  if (failed || !current) {
    return (
      <div
        className={cn('flex items-center justify-center bg-[#f3efe6]', className)}
        aria-hidden
      >
        <span className="font-display text-sm tracking-[0.14em] uppercase text-[#b8975c]/50">
          Aura
        </span>
      </div>
    )
  }

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      className={cn('bg-[#f3efe6]', className)}
      onError={() => {
        if (current !== fallback && fallback) {
          setCurrent(fallback)
          return
        }
        setFailed(true)
      }}
    />
  )
}

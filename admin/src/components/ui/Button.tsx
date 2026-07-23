import { cn } from '@utils/index'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        variant === 'primary' && 'bg-forest text-cream hover:bg-forest/90',
        variant === 'outline' &&
          'border border-charcoal/15 bg-white hover:border-forest hover:text-forest',
        variant === 'ghost' && 'hover:bg-charcoal/5',
        className,
      )}
      {...props}
    />
  )
}

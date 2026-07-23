import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'circle'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-forest text-warm-white hover:bg-forest-deep border border-transparent',
  secondary:
    'bg-beige text-charcoal hover:bg-beige-deep border border-transparent',
  ghost:
    'bg-transparent text-charcoal hover:bg-beige/50 border border-transparent',
  outline:
    'bg-transparent text-charcoal border border-charcoal/20 hover:border-forest hover:text-forest',
  gold:
    'bg-soft-gold text-charcoal hover:bg-soft-gold-light border border-transparent',
  inverse:
    'bg-warm-white/15 text-warm-white border border-warm-white/35 hover:bg-warm-white/25 backdrop-blur-md',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-5 text-micro tracking-[0.22em]',
  md: 'h-12 px-7 text-micro tracking-[0.22em]',
  lg: 'h-14 px-9 text-micro tracking-[0.24em]',
  circle:
    'h-16 w-16 rounded-full text-micro tracking-[0.18em] px-0 justify-center',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  fullWidth,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 uppercase transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'disabled:pointer-events-none disabled:opacity-40',
        size === 'circle' ? 'rounded-full' : 'rounded-full',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

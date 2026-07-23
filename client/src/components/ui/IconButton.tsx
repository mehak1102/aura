import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  label: string
  tone?: 'dark' | 'light'
}

export function IconButton({
  children,
  label,
  className,
  tone = 'dark',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300',
        tone === 'dark'
          ? 'text-charcoal hover:bg-beige/60'
          : 'text-warm-white hover:bg-warm-white/15',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

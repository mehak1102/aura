import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  tone?: 'forest' | 'gold' | 'beige' | 'inverse'
}

const tones = {
  forest: 'bg-forest text-warm-white',
  gold: 'bg-soft-gold/20 text-forest',
  beige: 'bg-beige text-charcoal',
  inverse: 'bg-warm-white/15 text-warm-white border border-warm-white/25',
}

export function Badge({ children, className, tone = 'beige', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-micro',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('rule border-0', className)} />
}

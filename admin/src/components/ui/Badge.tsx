import type { ReactNode } from 'react'
import { cn } from '@utils/index'

const tones = {
  default: 'bg-charcoal/5 text-charcoal',
  success: 'bg-forest/10 text-forest',
  warning: 'bg-soft-gold/20 text-charcoal',
  danger: 'bg-red-50 text-red-700',
} as const

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

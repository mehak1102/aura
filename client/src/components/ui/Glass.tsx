import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

type GlassProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  tone?: 'light' | 'dark'
  padding?: boolean
}

export function Glass({
  children,
  className,
  tone = 'light',
  padding = true,
  ...props
}: GlassProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        tone === 'light' ? 'glass' : 'glass-dark',
        padding && 'p-6 md:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

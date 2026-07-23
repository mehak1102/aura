import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode
  tone?: 'forest' | 'olive' | 'gold' | 'inverse' | 'muted'
}

const tones = {
  forest: 'text-forest',
  olive: 'text-olive',
  gold: 'text-soft-gold',
  inverse: 'text-warm-white/80',
  muted: 'text-charcoal-muted',
}

export function Eyebrow({ children, className, tone = 'olive', ...props }: EyebrowProps) {
  return (
    <p className={cn('text-micro', tones[tone], className)} {...props}>
      {children}
    </p>
  )
}

type DisplayProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm'
  italic?: boolean
}

const sizes = {
  '2xl': 'text-[length:var(--text-display-2xl)]',
  xl: 'text-[length:var(--text-display-xl)]',
  lg: 'text-[length:var(--text-display-lg)]',
  md: 'text-[length:var(--text-display-md)]',
  sm: 'text-[length:var(--text-display-sm)]',
}

export function Display({
  children,
  className,
  as: Tag = 'h2',
  size = 'lg',
  italic,
  ...props
}: DisplayProps) {
  return (
    <Tag
      className={cn('font-display', sizes[size], italic && 'italic', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

type BodyProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode
  size?: 'lg' | 'md' | 'sm'
  muted?: boolean
}

export function Body({
  children,
  className,
  size = 'md',
  muted,
  ...props
}: BodyProps) {
  return (
    <p
      className={cn(
        'font-light',
        size === 'lg' && 'text-[length:var(--text-body-lg)]',
        size === 'md' && 'text-[length:var(--text-body)]',
        size === 'sm' && 'text-[length:var(--text-body-sm)]',
        muted ? 'text-charcoal-muted' : 'text-charcoal',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@utils/index'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  narrow?: boolean
}

export function Container({ children, className, narrow, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[var(--spacing-gutter)]',
        narrow ? 'max-w-3xl' : 'max-w-[var(--spacing-content)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  as?: 'section' | 'div' | 'article'
}

export function Section({
  children,
  className,
  size = 'md',
  as: Tag = 'section',
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        size === 'sm' && 'py-[var(--spacing-section-sm)]',
        size === 'md' && 'py-[var(--spacing-section)]',
        size === 'lg' && 'py-[calc(var(--spacing-section)*1.25)]',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

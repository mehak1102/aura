import {
  useCallback,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@utils/index'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  strength?: number
  className?: string
  fullWidth?: boolean
}

/** Soft magnetic pull toward cursor — luxury micro-interaction */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    },
    [strength],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'inline-flex will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        fullWidth && 'w-full',
        className,
      )}
    >
      <Button variant={variant} size={size} fullWidth={fullWidth} {...props}>
        {children}
      </Button>
    </div>
  )
}

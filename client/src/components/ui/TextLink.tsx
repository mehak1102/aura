import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { cn } from '@utils/index'

type TextLinkProps = RouterLinkProps & {
  underline?: boolean
  tone?: 'default' | 'muted' | 'inverse' | 'gold'
}

const tones = {
  default: 'text-charcoal',
  muted: 'text-charcoal-muted',
  inverse: 'text-warm-white',
  gold: 'text-soft-gold',
}

/** Editorial text link with draw-underline */
export function TextLink({
  className,
  underline = true,
  tone = 'default',
  children,
  ...props
}: TextLinkProps) {
  return (
    <RouterLink
      className={cn(
        'group relative inline-flex items-center text-micro tracking-[0.22em] uppercase transition-colors duration-300',
        tones[tone],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {underline && (
        <span
          className={cn(
            'absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100',
            tone === 'inverse' || tone === 'gold' ? 'bg-current' : 'bg-forest',
          )}
        />
      )}
    </RouterLink>
  )
}

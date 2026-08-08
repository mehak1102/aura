import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

type LogoProps = {
  className?: string
  tone?: 'dark' | 'light' | 'gold'
  compact?: boolean
  /** Stacked AURA / OF NATURE lockup matching the portal hero mockup */
  editorial?: boolean
  /** Lets off-screen containers (e.g. the closed site menu) skip the link */
  tabIndex?: number
  onClick?: () => void
}

/** Leaf mark — muted beige gold from hero floral linework */
const LEAF_GOLD = '#C2A378'
/** Logo wordmark — pale warm beige (lighter than the leaf) */
const WORDMARK = '#D9D2C5'

export function Logo({
  className,
  tone = 'dark',
  compact,
  editorial,
  tabIndex,
  onClick,
}: LogoProps) {
  const onHero = tone === 'light' || tone === 'gold'
  const wordColor = onHero ? WORDMARK : '#0c0f0c'
  const leafColor = onHero ? LEAF_GOLD : '#b8975c'

  return (
    <Link
      to={ROUTES.home}
      aria-label="Aura of Nature home"
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn('group inline-flex flex-col items-center gap-0.5 py-1', className)}
    >
      <svg
        viewBox="0 0 28 26"
        className="h-5 w-5 md:h-6 md:w-6"
        fill="none"
        aria-hidden
        style={{ color: leafColor }}
      >
        <path
          d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
          fill="currentColor"
        />
        <path
          d="M7.2 8.5C5.4 12.2 4.6 15.2 5.2 17.6a3.4 3.4 0 0 0 6.1 1.4C10.2 16.4 9.2 12.8 7.2 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
        <path
          d="M20.8 8.5C22.6 12.2 23.4 15.2 22.8 17.6a3.4 3.4 0 0 1-6.1 1.4C17.8 16.4 18.8 12.8 20.8 8.5Z"
          fill="currentColor"
          opacity="0.88"
        />
      </svg>
      {!compact && editorial && (
        <span className="text-center leading-none">
          <span
            className="block text-[0.95rem] font-medium tracking-[0.14em] sm:text-[1.1rem] sm:tracking-[0.16em] md:text-[1.3rem] md:tracking-[0.2em] lg:text-[1.5rem]"
            style={{
              fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
              color: wordColor,
            }}
          >
            AURA
          </span>
          <span
            className="mt-0.5 block text-[0.42rem] font-medium tracking-[0.32em] uppercase sm:mt-1 sm:text-[0.48rem] sm:tracking-[0.4em] md:text-[0.55rem] md:tracking-[0.48em] lg:text-[0.6rem]"
            style={{ color: wordColor }}
          >
            Of Nature
          </span>
        </span>
      )}
      {!compact && !editorial && (
        <span className="text-center">
          <span
            className="font-display block text-[1.05rem] font-semibold leading-none tracking-[0.12em] md:text-[1.2rem]"
            style={{ color: wordColor }}
          >
            Aura of Nature
          </span>
          <span
            className="mt-1.5 block text-[0.52rem] font-medium tracking-[0.28em] uppercase"
            style={{ color: onHero ? 'rgba(217,210,197,0.8)' : 'rgba(12,15,12,0.8)' }}
          >
            Pure · Natural · Nourishing
          </span>
        </span>
      )}
    </Link>
  )
}

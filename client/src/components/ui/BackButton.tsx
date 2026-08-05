import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@utils/index'

type BackButtonProps = {
  /** Fallback route when the page was opened directly (no in-app history) */
  to: string
  label?: string
  /** Use on dark hero sections */
  tone?: 'light' | 'dark'
  className?: string
}

const tones = {
  light:
    'border-charcoal/15 bg-warm-white/60 text-forest hover:border-forest hover:bg-warm-white',
  dark:
    'border-warm-white/30 bg-warm-white/10 text-warm-white hover:border-warm-white/60 hover:bg-warm-white/20',
}

/** Back to parent listing — history-aware with a predictable fallback. */
export function BackButton({
  to,
  label = 'Back',
  tone = 'light',
  className,
}: BackButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // 'default' key means this was the first entry — no in-app history to pop
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(to)
  }

  return (
    <button
      type="button"
      data-page-reveal=""
      onClick={goBack}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-micro tracking-[0.18em] uppercase backdrop-blur-sm transition-colors duration-400',
        tones[tone],
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 transition-transform duration-400 group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      {label}
    </button>
  )
}

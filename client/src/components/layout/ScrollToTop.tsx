import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@utils/index'

/** Soft-gold scroll-to-top — matches reference chrome */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-[#b8975c] text-[#1b261e] shadow-lg transition-all duration-300 md:bottom-8 md:right-7',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
    </button>
  )
}

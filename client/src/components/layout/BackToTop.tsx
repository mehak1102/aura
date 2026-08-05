import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { cn } from '@utils/index'
import { scrollToY } from '@/lib/lenisControl'

/** Soft-gold back-to-top button — only on long pages, once the user has scrolled */
export function BackToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const isLongPage =
        document.documentElement.scrollHeight > window.innerHeight * 2
      setVisible(isLongPage && window.scrollY > window.innerHeight * 0.75)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    // Content (images, lazy sections) can change page height after mount
    const settle = window.setTimeout(update, 600)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.clearTimeout(settle)
    }
  }, [pathname])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToY(0)}
      className={cn(
        'fixed bottom-6 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-[#b8975c] text-[#1b261e] shadow-lg transition-all duration-300 md:bottom-8 md:right-7',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
    </button>
  )
}

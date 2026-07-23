import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCart } from '@contexts/CartContext'
import { ROUTES } from '@/routes/paths'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { toastPop, motionEase } from '@animations/framer/presets'

/** Lightweight confirmation toast after add-to-cart */
export function CartToast() {
  const { justAdded, clearJustAdded, count } = useCart()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!justAdded) return
    const t = window.setTimeout(() => clearJustAdded(), 2800)
    return () => window.clearTimeout(t)
  }, [justAdded, clearJustAdded])

  return (
    <AnimatePresence>
      {justAdded && (
        <motion.div
          key="cart-toast"
          role="status"
          className="fixed bottom-6 left-1/2 z-[var(--z-overlay)] w-[min(92vw,24rem)] -translate-x-1/2"
          initial={reduced ? false : toastPop.initial}
          animate={toastPop.animate}
          exit={reduced ? undefined : toastPop.exit}
          transition={{ duration: 0.4, ease: motionEase }}
        >
          <div className="flex items-center justify-between gap-4 rounded-full border border-charcoal/10 bg-cream/95 px-5 py-3 shadow-[var(--shadow-lift)] backdrop-blur-md">
            <p className="inline-flex items-center gap-2 text-sm text-charcoal">
              <Check className="h-4 w-4 text-forest" strokeWidth={1.75} />
              Added to bag ({count})
            </p>
            <Link
              to={ROUTES.cart}
              onClick={clearJustAdded}
              className="text-micro text-forest"
            >
              View
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

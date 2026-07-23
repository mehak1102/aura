import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { fadeUp } from './presets'

type MotionRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fade-up wrapper that respects reduced motion */
export function MotionReveal({ children, delay = 0, className }: MotionRevealProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ ...fadeUp.transition, delay }}
    >
      {children}
    </motion.div>
  )
}

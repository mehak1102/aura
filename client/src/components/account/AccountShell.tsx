import type { ReactNode } from 'react'
import { AccountNav } from './AccountNav'

type AccountShellProps = {
  children: ReactNode
}

const LEAF_ANGLES = [-34, 212, -28, 206, -24, 202, -20, 198]
const LEAF_ORIGINS = [262, 262, 206, 206, 150, 150, 96, 96]

/** Soft sage leaf sprig used as a page watermark. */
function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 330"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        fill="#9caf88"
        fillOpacity="0.3"
        stroke="#7f9470"
        strokeOpacity="0.35"
        strokeWidth="1.1"
      >
        <path
          d="M104 322 C 100 262 104 200 110 142 C 114 100 118 60 120 26"
          fill="none"
          strokeWidth="1.3"
        />
        {LEAF_ANGLES.map((angle, i) => (
          <g
            key={`${angle}-${i}`}
            transform={`translate(${106 + i} ${LEAF_ORIGINS[i]}) rotate(${angle})`}
          >
            <path d="M0 0 C 16 -20 46 -24 66 -6 C 46 16 16 18 0 0 Z" />
            <path
              d="M2 -1 C 22 -6 46 -9 64 -7"
              fill="none"
              strokeWidth="0.85"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function AccountShell({ children }: AccountShellProps) {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <LeafSprig className="pointer-events-none absolute top-20 -left-20 hidden h-[28rem] w-auto -rotate-12 opacity-70 lg:block" />
      <LeafSprig className="pointer-events-none absolute top-44 -right-20 hidden h-[32rem] w-auto rotate-[168deg] opacity-70 lg:block" />

      <div className="container-aura relative flex flex-col gap-8 pb-[var(--spacing-section)] lg:flex-row lg:gap-12">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}

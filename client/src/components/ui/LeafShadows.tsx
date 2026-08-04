const LEAF_PATH =
  'M60 8 C92 28 112 70 98 118 C84 148 60 156 60 156 C60 156 36 148 22 118 C8 70 28 28 60 8Z'

type LeafSpec = {
  className: string
  rotate?: number
}

const LEAVES: LeafSpec[] = [
  // Top-left cluster
  { className: 'absolute -left-8 top-14 h-56 w-48 opacity-[0.18] blur-[11px] sm:h-72 sm:w-56 md:top-20' },
  { className: 'absolute left-16 top-28 h-44 w-36 opacity-[0.13] blur-[10px] sm:left-24 sm:h-52 sm:w-40', rotate: 28 },
  { className: 'absolute left-4 top-56 h-36 w-28 opacity-[0.11] blur-[9px] sm:top-64 sm:h-40', rotate: -18 },
  { className: 'absolute left-28 top-72 h-28 w-24 opacity-[0.09] blur-[8px] sm:left-36', rotate: 42 },
  { className: 'absolute -left-2 top-[18%] h-40 w-32 opacity-[0.1] blur-[10px]', rotate: -32 },

  // Top-right cluster
  { className: 'absolute -right-6 top-16 h-60 w-52 opacity-[0.17] blur-[12px] sm:h-72 sm:w-56 md:top-24', rotate: -22 },
  { className: 'absolute right-14 top-36 h-48 w-40 opacity-[0.12] blur-[10px] sm:right-20 sm:h-56 sm:w-44', rotate: 14 },
  { className: 'absolute right-2 top-64 h-40 w-32 opacity-[0.1] blur-[9px] sm:top-72', rotate: 40 },
  { className: 'absolute right-24 top-80 h-32 w-28 opacity-[0.09] blur-[8px] sm:right-32', rotate: -48 },
  { className: 'absolute -right-4 top-[20%] h-44 w-36 opacity-[0.1] blur-[11px]', rotate: 55 },

  // Upper-mid sides
  { className: 'absolute left-[2%] top-[24%] h-48 w-40 opacity-[0.1] blur-[12px]', rotate: 50 },
  { className: 'absolute right-[3%] top-[26%] h-52 w-44 opacity-[0.1] blur-[12px]', rotate: -35 },
  { className: 'absolute left-[8%] top-[30%] h-36 w-28 opacity-[0.08] blur-[11px]', rotate: -12 },
  { className: 'absolute right-[9%] top-[32%] h-40 w-32 opacity-[0.08] blur-[11px]', rotate: 28 },

  // Mid page
  { className: 'absolute left-[4%] top-[42%] h-48 w-40 opacity-[0.1] blur-[13px]', rotate: 18 },
  { className: 'absolute right-[5%] top-[44%] h-52 w-44 opacity-[0.1] blur-[13px]', rotate: -40 },
  { className: 'absolute left-[14%] top-[48%] h-36 w-28 opacity-[0.08] blur-[12px]', rotate: -55 },
  { className: 'absolute right-[12%] top-[50%] h-40 w-32 opacity-[0.08] blur-[12px]', rotate: 62 },
  { className: 'absolute left-[22%] top-[45%] hidden h-32 w-24 opacity-[0.07] blur-[14px] xl:block', rotate: 8 },
  { className: 'absolute right-[20%] top-[47%] hidden h-32 w-24 opacity-[0.07] blur-[14px] xl:block', rotate: -20 },

  // Lower-mid
  { className: 'absolute left-[3%] top-[58%] h-44 w-36 opacity-[0.1] blur-[12px]', rotate: -28 },
  { className: 'absolute right-[4%] top-[60%] h-48 w-40 opacity-[0.1] blur-[12px]', rotate: 32 },
  { className: 'absolute left-[11%] top-[64%] h-36 w-28 opacity-[0.08] blur-[11px]', rotate: 45 },
  { className: 'absolute right-[10%] top-[66%] h-40 w-32 opacity-[0.08] blur-[11px]', rotate: -52 },
  { className: 'absolute left-[35%] top-[55%] hidden h-28 w-24 opacity-[0.06] blur-[14px] lg:block', rotate: 70 },
  { className: 'absolute right-[32%] top-[58%] hidden h-28 w-24 opacity-[0.06] blur-[14px] lg:block', rotate: -65 },

  // Lower third
  { className: 'absolute left-[2%] top-[72%] h-48 w-40 opacity-[0.11] blur-[11px]', rotate: 12 },
  { className: 'absolute right-[3%] top-[74%] h-52 w-44 opacity-[0.11] blur-[12px]', rotate: -18 },
  { className: 'absolute left-[9%] top-[78%] h-36 w-28 opacity-[0.09] blur-[10px]', rotate: -38 },
  { className: 'absolute right-[8%] top-[80%] h-40 w-32 opacity-[0.09] blur-[10px]', rotate: 48 },
  { className: 'absolute left-[28%] top-[76%] hidden h-32 w-24 opacity-[0.07] blur-[13px] lg:block', rotate: 22 },
  { className: 'absolute right-[26%] top-[78%] hidden h-32 w-24 opacity-[0.07] blur-[13px] lg:block', rotate: -30 },

  // Bottom corners
  { className: 'absolute -bottom-2 left-[3%] h-52 w-44 opacity-[0.13] blur-[11px] sm:h-60 sm:w-48', rotate: 12 },
  { className: 'absolute -bottom-4 right-[5%] h-56 w-48 opacity-[0.12] blur-[12px] sm:h-64 sm:w-52', rotate: -18 },
  { className: 'absolute bottom-[8%] left-[18%] h-40 w-32 opacity-[0.09] blur-[11px]', rotate: 55 },
  { className: 'absolute bottom-[10%] right-[16%] h-44 w-36 opacity-[0.09] blur-[11px]', rotate: -42 },
  { className: 'absolute bottom-[4%] left-[42%] hidden h-36 w-28 opacity-[0.07] blur-[14px] xl:block', rotate: 70 },
]

/** Soft cast leaf shadows — organic shapes, heavy blur. Full-bleed decorative layer. */
export function LeafShadows({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-leaf-shadows=""
      className={
        className ??
        'pointer-events-none absolute inset-0 z-0 overflow-hidden'
      }
    >
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          className={leaf.className}
          viewBox="0 0 120 160"
          fill="#243528"
          style={
            leaf.rotate != null
              ? { transform: `rotate(${leaf.rotate}deg)` }
              : undefined
          }
        >
          <path d={LEAF_PATH} />
        </svg>
      ))}
    </div>
  )
}

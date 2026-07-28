import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { ArrowRight, Flower2, Leaf, ShoppingBag } from 'lucide-react'
import { gsap, prefersReducedMotion } from '@animations/gsap'
import { cn } from '@utils/index'

type BurstTheme = 'botanical' | 'coffee' | 'lavender' | 'tea-tree'

type AddToCartButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  label?: string
  size?: 'md' | 'sm'
  className?: string
  fullWidth?: boolean
  burstTheme?: BurstTheme
}

type BurstElement = {
  kind: 'leaf' | 'flower' | 'gold' | 'bag'
  side: 'left' | 'right'
  x: number
  y: number
  rotate: number
  size: number
  delay: number
  opacity: number
  anchorX: number
  anchorY: number
}

const BURSTS: Record<BurstTheme, BurstElement[]> = {
  botanical: [
    { kind: 'leaf', side: 'left', x: -46, y: -42, rotate: -26, size: 18, delay: 0.0, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'gold', side: 'left', x: -18, y: -50, rotate: 0, size: 9, delay: 0.03, opacity: 0.7, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'left', x: -12, y: -34, rotate: -12, size: 14, delay: 0.06, opacity: 0.68, anchorX: 50, anchorY: 72 },
    { kind: 'leaf', side: 'right', x: 46, y: -42, rotate: 24, size: 17, delay: 0.09, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'bag', side: 'right', x: 18, y: -50, rotate: 10, size: 10, delay: 0.12, opacity: 0.6, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'right', x: 12, y: -34, rotate: 10, size: 13, delay: 0.15, opacity: 0.64, anchorX: 50, anchorY: 72 },
  ],
  coffee: [
    { kind: 'leaf', side: 'left', x: -44, y: -42, rotate: -22, size: 18, delay: 0.0, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'gold', side: 'left', x: -16, y: -48, rotate: 0, size: 9, delay: 0.03, opacity: 0.68, anchorX: 50, anchorY: 72 },
    { kind: 'bag', side: 'left', x: -10, y: -34, rotate: 16, size: 10, delay: 0.06, opacity: 0.58, anchorX: 50, anchorY: 72 },
    { kind: 'leaf', side: 'right', x: 44, y: -42, rotate: 18, size: 17, delay: 0.09, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'right', x: 16, y: -48, rotate: 0, size: 11, delay: 0.12, opacity: 0.62, anchorX: 50, anchorY: 72 },
    { kind: 'leaf', side: 'right', x: 10, y: -34, rotate: 8, size: 13, delay: 0.15, opacity: 0.6, anchorX: 50, anchorY: 72 },
  ],
  lavender: [
    { kind: 'leaf', side: 'left', x: -42, y: -42, rotate: -24, size: 17, delay: 0.0, opacity: 0.68, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'left', x: -16, y: -50, rotate: -14, size: 13, delay: 0.03, opacity: 0.66, anchorX: 50, anchorY: 72 },
    { kind: 'bag', side: 'left', x: -8, y: -34, rotate: 0, size: 10, delay: 0.06, opacity: 0.58, anchorX: 50, anchorY: 72 },
    { kind: 'leaf', side: 'right', x: 42, y: -42, rotate: 22, size: 17, delay: 0.09, opacity: 0.68, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'right', x: 16, y: -50, rotate: 12, size: 13, delay: 0.12, opacity: 0.66, anchorX: 50, anchorY: 72 },
    { kind: 'gold', side: 'right', x: 8, y: -34, rotate: 0, size: 9, delay: 0.15, opacity: 0.62, anchorX: 50, anchorY: 72 },
  ],
  'tea-tree': [
    { kind: 'leaf', side: 'left', x: -44, y: -42, rotate: -28, size: 18, delay: 0.0, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'left', x: -16, y: -50, rotate: 14, size: 12, delay: 0.03, opacity: 0.64, anchorX: 50, anchorY: 72 },
    { kind: 'bag', side: 'left', x: -8, y: -34, rotate: 0, size: 10, delay: 0.06, opacity: 0.58, anchorX: 50, anchorY: 72 },
    { kind: 'leaf', side: 'right', x: 44, y: -42, rotate: 24, size: 18, delay: 0.09, opacity: 0.72, anchorX: 50, anchorY: 72 },
    { kind: 'flower', side: 'right', x: 16, y: -50, rotate: -14, size: 12, delay: 0.12, opacity: 0.64, anchorX: 50, anchorY: 72 },
    { kind: 'gold', side: 'right', x: 8, y: -34, rotate: 8, size: 9, delay: 0.15, opacity: 0.58, anchorX: 50, anchorY: 72 },
  ],
}

function BurstShape({
  kind,
  size,
}: {
  kind: BurstElement['kind']
  size: number
}) {
  if (kind === 'gold') {
    return (
      <span
        className="block rounded-full blur-[0.6px]"
        style={{
          width: size,
          height: size,
          background: 'rgba(216, 184, 122, 0.95)',
        }}
      />
    )
  }

  if (kind === 'flower') {
    return (
      <Flower2
        style={{ width: size, height: size, opacity: 1, color: '#1e3a25' }}
        strokeWidth={2.4}
      />
    )
  }

  if (kind === 'bag') {
    return (
      <ShoppingBag
        style={{ width: size, height: size, opacity: 1, color: '#9d6f2b' }}
        strokeWidth={2.4}
      />
    )
  }

  return (
    <Leaf
      style={{ width: size, height: size, opacity: 1, color: '#21452b' }}
      strokeWidth={2.5}
    />
  )
}

export function AddToCartButton({
  label = 'Add to Cart',
  size = 'md',
  className,
  fullWidth,
  burstTheme = 'botanical',
  disabled,
  onClick,
  ...props
}: AddToCartButtonProps) {
  const isSm = size === 'sm'
  const rootRef = useRef<HTMLButtonElement>(null)
  const bagRef = useRef<HTMLSpanElement>(null)
  const arrowWrapRef = useRef<HTMLSpanElement>(null)
  const arrowIconRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)
  const burstRefs = useRef<Array<HTMLSpanElement | null>>([])
  const reducedRef = useRef(false)
  const resetTimerRef = useRef<number | null>(null)
  const [flashAdded, setFlashAdded] = useState(false)
  const burst = useMemo(() => BURSTS[burstTheme], [burstTheme])

  useEffect(() => {
    reducedRef.current = prefersReducedMotion()
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    burstRefs.current.forEach((el, index) => {
      const item = burst[index]
      if (!el || !item) return
      gsap.set(el, {
        left: `${item.anchorX}%`,
        top: `${item.anchorY}%`,
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotation: 0,
      })
    })
  }, [burst])

  const animateOut = useCallback(() => {
    const root = rootRef.current
    if (!root) return

    gsap.to(root, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    if (bagRef.current) {
      gsap.to(bagRef.current, { scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
    }
    if (arrowWrapRef.current) {
      gsap.to(arrowWrapRef.current, { scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
    }
    if (arrowIconRef.current) {
      gsap.to(arrowIconRef.current, {
        x: 0,
        rotation: 0,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    burstRefs.current.forEach((el) => {
      if (!el) return
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotation: 0,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }, [])

  const animateIn = useCallback(() => {
    const root = rootRef.current
    if (!root) return

    gsap.to(root, {
      y: -3,
      boxShadow: '0 14px 28px rgba(35,69,44,0.26)',
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.22,
        scale: 1.04,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    if (bagRef.current) {
      gsap.to(bagRef.current, { scale: 1.06, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }
    if (arrowWrapRef.current) {
      gsap.to(arrowWrapRef.current, { scale: 1.08, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }
    if (arrowIconRef.current) {
      gsap.to(arrowIconRef.current, {
        x: 4,
        rotation: 45,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    burstRefs.current.forEach((el, index) => {
      const item = burst[index]
      if (!el || !item) return
      gsap.fromTo(
        el,
        {
          left: `${item.anchorX}%`,
          top: `${item.anchorY}%`,
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotation: 0,
        },
        {
          keyframes: [
            {
              x: item.x,
              y: item.y,
              scale: 1,
              opacity: item.opacity,
              rotation: item.rotate,
              duration: 0.32,
              ease: 'power3.out',
            },
            {
              x: item.x + (item.side === 'left' ? -2 : 2),
              y: item.y - 3,
              scale: 0.88,
              opacity: item.opacity * 0.72,
              rotation: item.rotate + (item.side === 'left' ? -5 : 5),
              duration: 0.26,
              ease: 'sine.out',
            },
            {
              x: item.x + (item.side === 'left' ? -3 : 3),
              y: item.y - 5,
              scale: 0.76,
              opacity: 0,
              rotation: item.rotate + (item.side === 'left' ? -8 : 8),
              duration: 0.42,
              ease: 'power2.out',
            },
          ],
          delay: item.delay,
          overwrite: 'auto',
        },
      )
    })
  }, [burst])

  const handleMove = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    if (reducedRef.current) return
    const root = rootRef.current
    if (!root) return

    const rect = root.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    gsap.to(root, {
      x: dx * 0.12,
      y: dy * 0.14 - 3,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [])

  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      animateIn()
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
      setFlashAdded(true)
      resetTimerRef.current = window.setTimeout(() => {
        setFlashAdded(false)
        animateOut()
      }, 1400)

      onClick?.(e)
    },
    [animateIn, animateOut, disabled, onClick],
  )

  return (
    <button
      ref={rootRef}
      type="button"
      className={cn(
        'group relative inline-flex items-center justify-between gap-3 overflow-visible rounded-[9999px] bg-[#23452C] text-white',
        'font-[family-name:var(--font-sans)] font-medium tracking-[-0.01em]',
        'border border-[#23452C] shadow-[0_8px_24px_rgba(35,69,44,0.18)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8975c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isSm
          ? 'h-10 px-4 text-[0.8125rem] sm:h-11 sm:px-5 sm:text-[0.875rem]'
          : 'h-[52px] px-[22px] text-[15px]',
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      onClick={handleClick}
      onMouseMove={handleMove}
      {...props}
    >
      <span
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-[16%] bottom-[-24%] h-[64%] rounded-full bg-[radial-gradient(circle,rgba(216,184,122,0.2)_0%,rgba(216,184,122,0.08)_40%,transparent_76%)] opacity-0 blur-lg"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible rounded-[9999px]"
      >
        {burst.map((item, index) => (
          <span
            key={`${burstTheme}-${item.kind}-${index}`}
            ref={(el) => {
              burstRefs.current[index] = el
            }}
            className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
          >
            <BurstShape kind={item.kind} size={item.size} />
          </span>
        ))}
      </span>

      <span className="relative z-[2] flex min-w-0 flex-1 items-center gap-2.5 text-white">
        <span className="inline-flex shrink-0" aria-hidden>
          <span ref={bagRef} className="inline-flex">
          <ShoppingBag
            className={cn(isSm ? 'h-3.5 w-3.5' : 'h-4 w-4')}
            strokeWidth={1.75}
          />
          </span>
        </span>
        <span className="min-w-0 whitespace-nowrap text-left leading-none text-white">
          {flashAdded ? 'Added!' : label}
        </span>
      </span>

      <span
        aria-hidden
        ref={arrowWrapRef}
        className={cn(
          'relative z-[2] ml-auto inline-flex shrink-0 items-center justify-center rounded-full border border-white/55 text-white',
          isSm ? 'h-7 w-7' : 'h-8 w-8',
        )}
      >
        <span ref={arrowIconRef} className="inline-flex">
          <ArrowRight
            className={cn(isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')}
            strokeWidth={1.85}
          />
        </span>
      </span>
    </button>
  )
}

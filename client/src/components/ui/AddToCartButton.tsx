import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react'
import {
  ArrowRight,
  Check,
  Flower2,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import { gsap, prefersReducedMotion } from '@animations/gsap'
import { cn } from '@utils/index'

type Phase = 'idle' | 'added' | 'qty'
type BurstTheme = 'botanical' | 'coffee' | 'lavender' | 'tea-tree'

type AddToCartButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> & {
  label?: string
  size?: 'md' | 'sm'
  className?: string
  fullWidth?: boolean
  quantity?: number
  onAdd?: () => void
  onIncrement?: () => void
  onDecrement?: () => void
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  burstTheme?: BurstTheme
  deferBurst?: boolean
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

const GOLD = '#b08d57'
const CONFIRM_MS = 400

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
        style={{ width: size, height: size, color: '#1e3a25' }}
        strokeWidth={2.4}
      />
    )
  }
  if (kind === 'bag') {
    return (
      <ShoppingBag
        style={{ width: size, height: size, color: '#9d6f2b' }}
        strokeWidth={2.4}
      />
    )
  }
  return (
    <Leaf
      style={{ width: size, height: size, color: '#21452b' }}
      strokeWidth={2.5}
    />
  )
}

export function AddToCartButton({
  label = 'Add to Cart',
  size = 'md',
  className,
  fullWidth,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  onClick,
  disabled,
  burstTheme = 'botanical',
  deferBurst = true,
  ...props
}: AddToCartButtonProps) {
  const isSm = size === 'sm'
  const [phase, setPhase] = useState<Phase>(() => (quantity > 0 ? 'qty' : 'idle'))
  const [qtyPulse, setQtyPulse] = useState(false)
  const [burstReady, setBurstReady] = useState(!deferBurst)
  const confirmTimer = useRef<number | null>(null)
  const pulseTimer = useRef<number | null>(null)
  const skipNextQtySync = useRef(false)
  const burstRefs = useRef<Array<HTMLSpanElement | null>>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const burst = useMemo(() => BURSTS[burstTheme], [burstTheme])

  useEffect(() => {
    if (skipNextQtySync.current) {
      skipNextQtySync.current = false
      return
    }
    if (quantity <= 0) {
      setPhase('idle')
      return
    }
    if (phase === 'idle') setPhase('qty')
  }, [quantity, phase])

  useEffect(() => {
    return () => {
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current)
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!burstReady) return
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
  }, [burst, burstReady])

  const playBurst = useCallback(() => {
    if (prefersReducedMotion()) return
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

  const flashQty = () => {
    setQtyPulse(true)
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
    pulseTimer.current = window.setTimeout(() => setQtyPulse(false), 420)
  }

  const handleAdd = () => {
    if (disabled) return
    skipNextQtySync.current = true
    onAdd?.()
    onClick?.({} as never)

    const run = () => {
      playBurst()
      setPhase('added')
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current)
      confirmTimer.current = window.setTimeout(() => setPhase('qty'), CONFIRM_MS)
    }

    if (deferBurst && !burstReady) {
      setBurstReady(true)
      requestAnimationFrame(() => requestAnimationFrame(run))
    } else {
      run()
    }
  }

  const height = isSm ? 'h-10 sm:h-11' : 'h-[52px]'
  const textSize = isSm
    ? 'text-[0.8125rem] sm:text-[0.875rem]'
    : 'text-[15px]'

  return (
    <div
      ref={rootRef}
      className={cn('relative overflow-visible', fullWidth && 'w-full', className)}
    >
      {/* Burst layer — stays mounted so pop-ups are visible across states */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] overflow-visible"
      >
        {burstReady
          ? burst.map((item, index) => (
              <span
                key={`${burstTheme}-${item.kind}-${index}`}
                ref={(el) => {
                  burstRefs.current[index] = el
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <BurstShape kind={item.kind} size={item.size} />
              </span>
            ))
          : null}
      </span>

      {phase === 'added' ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'relative z-[2] inline-flex items-center justify-between gap-3 rounded-full text-white',
            'font-medium tracking-[-0.01em]',
            height,
            isSm ? 'px-3.5 sm:px-4' : 'px-5',
            textSize,
            fullWidth && 'w-full',
          )}
          style={{
            backgroundColor: GOLD,
            boxShadow:
              'inset 0 0 0 2px rgba(255,255,255,0.55), 0 8px 22px rgba(176,141,87,0.28)',
          }}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full bg-white/95',
                isSm ? 'h-5 w-5' : 'h-6 w-6',
              )}
              style={{ color: GOLD }}
            >
              <Check className={cn(isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')} strokeWidth={2.5} />
            </span>
            <span className="whitespace-nowrap leading-none">Added!</span>
          </span>
          <span
            aria-hidden
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-full border border-white/70',
              isSm ? 'h-7 w-7' : 'h-8 w-8',
            )}
          >
            <ArrowRight className={cn(isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')} strokeWidth={1.85} />
          </span>
        </div>
      ) : phase === 'qty' && quantity > 0 ? (
        <div
          className={cn(
            'relative z-[2] inline-grid grid-cols-3 items-stretch overflow-hidden rounded-full border bg-[#faf7f1]',
            height,
            fullWidth && 'w-full',
          )}
          style={{ borderColor: `${GOLD}99` }}
          role="group"
          aria-label="Cart quantity"
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={disabled}
            onClick={() => {
              onDecrement?.()
              flashQty()
            }}
            className={cn(
              'inline-flex items-center justify-center border-r text-[#2a2a28] transition-colors hover:bg-black/[0.03] disabled:opacity-50',
              textSize,
            )}
            style={{ borderColor: `${GOLD}55` }}
          >
            <Minus className={cn(isSm ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
          </button>
          <span
            className={cn(
              'inline-flex items-center justify-center border-r font-semibold tabular-nums transition-colors duration-300',
              textSize,
              qtyPulse ? 'text-[#b08d57]' : 'text-[#2a2a28]',
            )}
            style={{ borderColor: `${GOLD}55` }}
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={disabled}
            onClick={() => {
              onIncrement?.()
              flashQty()
            }}
            className={cn(
              'inline-flex items-center justify-center text-[#2a2a28] transition-colors hover:bg-black/[0.03] disabled:opacity-50',
              textSize,
            )}
          >
            <Plus className={cn(isSm ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            'relative z-[2] inline-flex items-center justify-between gap-3 overflow-visible rounded-full text-white',
            'font-medium tracking-[-0.01em]',
            'bg-[#23452C] shadow-[0_8px_24px_rgba(35,69,44,0.18)]',
            'transition-[background-color,box-shadow,transform] duration-300',
            'hover:bg-[#2a5335] active:scale-[0.99]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8975c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            height,
            isSm ? 'px-4 sm:px-5' : 'px-[22px]',
            textSize,
            fullWidth && 'w-full',
          )}
          disabled={disabled}
          onClick={handleAdd}
          {...props}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <ShoppingBag
              className={cn(isSm ? 'h-3.5 w-3.5' : 'h-4 w-4')}
              strokeWidth={1.75}
            />
            <span className="whitespace-nowrap leading-none">{label}</span>
          </span>
          <span
            aria-hidden
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-full border border-white/55',
              isSm ? 'h-7 w-7' : 'h-8 w-8',
            )}
          >
            <ArrowRight
              className={cn(isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')}
              strokeWidth={1.85}
            />
          </span>
        </button>
      )}
    </div>
  )
}

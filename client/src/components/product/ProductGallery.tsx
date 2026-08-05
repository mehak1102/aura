import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  X,
  ZoomIn,
} from 'lucide-react'
import type { ProductMedia } from '@/types'
import { cn } from '@utils/index'
import { productImageUrl } from '@utils/productImage'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import { motionEase } from '@animations/framer/presets'

type ProductGalleryProps = {
  images: ProductMedia[]
  title: string
}

type ViewMode = 'gallery' | 'spin' | 'zoom'

const MIN_ZOOM = 1
const MAX_ZOOM = 3.2
const ZOOM_STEP = 0.35

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const frames = images.length > 0 ? images : []
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<ViewMode>('gallery')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [lightbox, setLightbox] = useState(false)
  const [dragging, setDragging] = useState(false)
  const reduced = usePrefersReducedMotion()

  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    x: number
    y: number
    panX: number
    panY: number
    frame: number
    moved: boolean
  } | null>(null)

  const current = frames[active] ?? frames[0]
  const canSpin = frames.length >= 2
  const isZoomed = zoom > 1.02

  const goPrev = useCallback(
    () => setActive((i) => (i - 1 + frames.length) % frames.length),
    [frames.length],
  )
  const goNext = useCallback(
    () => setActive((i) => (i + 1) % frames.length),
    [frames.length],
  )

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const setModeSafe = useCallback(
    (next: ViewMode) => {
      setMode(next)
      resetView()
      if (next !== 'spin') setDragging(false)
    },
    [resetView],
  )

  const applyZoom = useCallback((nextRaw: number) => {
    const next = clampZoom(nextRaw)
    setZoom(next)
    if (next <= 1) {
      setPan({ x: 0, y: 0 })
      setMode((m) => (m === 'zoom' ? 'gallery' : m))
    } else {
      setMode((m) => (m === 'gallery' || m === 'spin' ? 'zoom' : m))
    }
  }, [])

  useEffect(() => {
    resetView()
    setMode((m) => (m === 'zoom' ? 'gallery' : m))
  }, [active, resetView])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, goNext, goPrev])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheelNative = (e: WheelEvent) => {
      if (mode === 'spin') return
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      setZoom((z) => {
        const next = clampZoom(z + delta)
        if (next <= 1) {
          setPan({ x: 0, y: 0 })
          setMode((m) => (m === 'zoom' ? 'gallery' : m))
        } else {
          setMode((m) => (m === 'gallery' || m === 'spin' ? 'zoom' : m))
        }
        return next
      })
    }
    el.addEventListener('wheel', onWheelNative, { passive: false })
    return () => el.removeEventListener('wheel', onWheelNative)
  }, [mode])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!current) return
    // Don't steal clicks from toolbar buttons
    if ((e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
      frame: active,
      moved: false,
    }
    setDragging(true)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true

    if (mode === 'spin' && canSpin) {
      const step = Math.round(dx / 42)
      const next =
        (drag.frame - step + frames.length * 20) % frames.length
      setActive(next)
      return
    }

    if (isZoomed || mode === 'zoom') {
      setPan({ x: drag.panX + dx, y: drag.panY + dy })
    }
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }

    if (drag && !drag.moved && mode === 'gallery' && !isZoomed) {
      setMode('zoom')
      setZoom(2)
    }
  }

  const hint =
    mode === 'spin'
      ? 'Drag to spin · multi-angle view'
      : isZoomed || mode === 'zoom'
        ? 'Drag to pan · scroll to zoom'
        : 'Click to zoom · scroll to zoom'

  return (
    <div className="space-y-4">
      <div
        ref={stageRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        className={cn(
          'product-gallery-stage relative isolate overflow-hidden rounded-2xl',
          'aspect-[4/5] md:aspect-[5/6]',
        )}
      >
        <div className="product-gallery-glow" aria-hidden />

        <div
          className={cn(
            'absolute inset-0 z-10 touch-none select-none',
            mode === 'spin' || isZoomed ? 'cursor-grab' : 'cursor-zoom-in',
            dragging && 'cursor-grabbing',
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="img"
          aria-label={`${title} product photo ${active + 1} of ${frames.length}`}
        >
          {/* Transform lives on a plain div so Framer Motion doesn't overwrite zoom/pan */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: dragging
                ? 'none'
                : reduced
                  ? undefined
                  : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <AnimatePresence mode="wait">
              {current && (
                <motion.img
                  key={mode === 'spin' ? `spin-${active}` : current.url}
                  src={productImageUrl(current.url, 'full')}
                  alt={current.alt || title}
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  initial={
                    reduced || mode === 'spin' ? false : { opacity: 0.55 }
                  }
                  animate={{ opacity: 1 }}
                  exit={reduced || mode === 'spin' ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3, ease: motionEase }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 md:p-4">
          <span className="rounded-full bg-[#faf8f4]/80 px-3 py-1 text-[0.62rem] tracking-[0.14em] text-forest/80 uppercase backdrop-blur-sm">
            {mode === 'spin'
              ? '360°'
              : isZoomed
                ? `${zoom.toFixed(1)}×`
                : 'Studio'}
          </span>
          <div className="pointer-events-auto flex items-center gap-1.5">
            <ToolbarButton
              label="Zoom out"
              onClick={() => applyZoom(zoom - ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </ToolbarButton>
            <ToolbarButton
              label="Zoom in"
              onClick={() => applyZoom(zoom + ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </ToolbarButton>
            {canSpin && (
              <ToolbarButton
                label={mode === 'spin' ? 'Exit 360 view' : 'Open 360 view'}
                active={mode === 'spin'}
                onClick={() =>
                  setModeSafe(mode === 'spin' ? 'gallery' : 'spin')
                }
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              </ToolbarButton>
            )}
            <ToolbarButton
              label="Reset view"
              onClick={() => {
                resetView()
                setMode('gallery')
              }}
            >
              <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.75} />
            </ToolbarButton>
            <ToolbarButton
              label="Open fullscreen"
              onClick={() => setLightbox(true)}
            >
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </ToolbarButton>
          </div>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center text-[0.62rem] tracking-[0.16em] text-forest/55 uppercase">
          {hint}
        </p>

        {mode === 'spin' && canSpin && (
          <div className="pointer-events-none absolute inset-x-8 bottom-10 z-20">
            <div className="mx-auto h-1 max-w-[12rem] overflow-hidden rounded-full bg-forest/10">
              <motion.div
                className="h-full rounded-full bg-soft-gold"
                style={{
                  width: `${((active + 1) / frames.length) * 100}%`,
                }}
                layout
                transition={{ duration: 0.25, ease: motionEase }}
              />
            </div>
          </div>
        )}
      </div>

      {frames.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
          {frames.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => {
                setActive(i)
                if (mode === 'spin') return
                setModeSafe('gallery')
              }}
              className={cn(
                'relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 sm:h-auto sm:w-auto sm:shrink',
                i === active
                  ? 'border-soft-gold shadow-[0_10px_28px_rgba(184,151,92,0.22)]'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
            >
              <img
                src={productImageUrl(img.url, 'full')}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* Portalled to <body>: the gallery column is `position: sticky`, which
          opens a stacking context that would otherwise keep this overlay
          painted beneath the product info column. */}
      {createPortal(
        <AnimatePresence>
          {lightbox && current && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a261c]/92 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(false)}
              role="dialog"
              aria-modal="true"
              aria-label={`${title} fullscreen gallery`}
            >
              <button
                type="button"
                className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white transition hover:bg-warm-white/20"
                aria-label="Close fullscreen"
                onClick={() => setLightbox(false)}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="absolute top-5 right-[4.25rem] inline-flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white transition hover:bg-warm-white/20"
                aria-label="Exit fullscreen"
                onClick={() => setLightbox(false)}
              >
                <Minimize2 className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Wrapper shrink-wraps the image so the arrows track its edges
                  rather than the viewport's. */}
              <div className="relative">
                <motion.img
                  key={current.url}
                  src={productImageUrl(current.url, 'full')}
                  alt={current.alt || title}
                  className="block max-h-[min(88vh,920px)] max-w-[min(92vw,860px)] object-contain"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: motionEase }}
                  onClick={(e) => e.stopPropagation()}
                />

                {frames.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute top-1/2 left-3 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#1a261c]/45 text-warm-white backdrop-blur-sm transition hover:bg-[#1a261c]/70"
                      aria-label="Previous image"
                      onClick={(e) => {
                        e.stopPropagation()
                        goPrev()
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#1a261c]/45 text-warm-white backdrop-blur-sm transition hover:bg-[#1a261c]/70"
                      aria-label="Next image"
                      onClick={(e) => {
                        e.stopPropagation()
                        goNext()
                      }}
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {frames.length > 1 && (
                <div
                  className="absolute inset-x-0 bottom-6 flex justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {frames.map((img, i) => (
                    <button
                      key={`lb-${img.url}-${i}`}
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        'h-2 w-2 rounded-full transition-all',
                        i === active
                          ? 'w-6 bg-soft-gold'
                          : 'bg-warm-white/35 hover:bg-warm-white/60',
                      )}
                      aria-label={`Fullscreen image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

function ToolbarButton({
  children,
  label,
  onClick,
  active,
  disabled,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300',
        active
          ? 'border-soft-gold bg-forest text-warm-white'
          : 'border-charcoal/10 bg-[#faf8f4]/85 text-forest hover:border-forest/30',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {children}
    </button>
  )
}

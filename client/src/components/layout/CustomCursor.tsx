import { useEffect, useState } from 'react'

/** Soft custom cursor — desktop fine pointer only */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHover(Boolean(t?.closest('a, button, [data-cursor-hover]')))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.documentElement.classList.add('aura-custom-cursor')
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('aura-custom-cursor')
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[var(--z-cursor)] mix-blend-difference"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${hover ? 1.8 : 1})`,
        transition: 'transform 180ms ease',
      }}
    >
      <span className="block h-3 w-3 rounded-full bg-[#F8F5EE]" />
    </div>
  )
}

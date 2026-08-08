import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { SORT_OPTIONS, type ShopSort } from '@/types/shop'
import { cn } from '@utils/index'

type ShopToolbarProps = {
  count: number
  sort: ShopSort
  onSortChange: (sort: ShopSort) => void
  onOpenFilters: () => void
}

export function ShopToolbar({
  count,
  sort,
  onSortChange,
  onOpenFilters,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/8 pb-4">
      <p className="text-[0.72rem] font-medium tracking-[0.18em] text-charcoal/55 uppercase">
        <span className="text-forest">{count}</span> products
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-[0.68rem] tracking-[0.14em] text-warm-white uppercase xl:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
          Filters
        </button>

        <SortSelect value={sort} onChange={onSortChange} />
      </div>
    </div>
  )
}

function SortSelect({
  value,
  onChange,
}: {
  value: ShopSort
  onChange: (sort: ShopSort) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0]

  useEffect(() => {
    if (!open) return

    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-flex items-center gap-2.5">
      <span className="hidden text-[0.72rem] tracking-[0.14em] text-charcoal/50 uppercase sm:inline">
        Sort by
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex min-w-[8.5rem] items-center justify-between gap-2.5 rounded-full sm:min-w-[9.5rem]',
          'border border-[#c4a35a]/75 bg-[#faf8f4] px-3.5 py-2',
          'text-[0.8rem] text-forest transition-colors duration-200',
          'hover:border-[#b8975c] hover:bg-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8975c]/45',
          open && 'border-[#b8975c] bg-white',
        )}
      >
        <span className="font-medium">{selected.label}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#b8975c] transition-transform duration-200',
            open && 'rotate-180',
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sort products"
          className={cn(
            'absolute top-[calc(100%+0.4rem)] right-0 z-30 min-w-[min(13.5rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-hidden',
            'rounded-2xl border border-[#c4a35a]/55 bg-[#faf8f4]',
            'py-1.5 shadow-[0_12px_32px_rgba(36,53,40,0.1)]',
            'animate-[fadeIn_180ms_ease-out]',
          )}
        >
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === value
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[0.82rem] transition-colors duration-150',
                    active
                      ? 'bg-[#243528] text-warm-white'
                      : 'text-charcoal/80 hover:bg-[#b8975c]/12 hover:text-forest',
                  )}
                >
                  <span className={active ? 'font-medium' : undefined}>{opt.label}</span>
                  {active && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#d4b87a]" strokeWidth={2.25} />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

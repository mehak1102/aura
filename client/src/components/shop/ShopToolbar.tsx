import { SlidersHorizontal } from 'lucide-react'
import { SORT_OPTIONS, type ShopSort } from '@/types/shop'

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
          className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-[0.68rem] tracking-[0.14em] text-warm-white uppercase lg:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
          Filters
        </button>

        <label className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.14em] text-charcoal/50 uppercase">
          Sort by
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ShopSort)}
            className="cursor-pointer rounded-full bg-warm-white px-3 py-1.5 text-[0.78rem] tracking-normal text-forest normal-case shadow-[0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-[#c4a35a]/70 outline-none transition focus:ring-[#b8975c]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

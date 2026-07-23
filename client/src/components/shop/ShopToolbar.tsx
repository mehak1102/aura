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
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
      <p className="text-sm text-charcoal-muted">
        <span className="text-charcoal">{count}</span> products
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-micro lg:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>

        <label className="inline-flex items-center gap-2 text-micro text-charcoal-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ShopSort)}
            className="border-0 border-b border-charcoal/20 bg-transparent py-1 text-charcoal outline-none focus:border-forest"
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

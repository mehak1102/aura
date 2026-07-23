import type { ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  CONCERN_OPTIONS,
  GENDER_OPTIONS,
  HAIR_OPTIONS,
  SKIN_OPTIONS,
  type ProductCategory,
  type ShopFilters as ShopFiltersType,
} from '@/types/shop'
import { getUniqueIngredients } from '@utils/shop'
import { cn } from '@utils/index'
import { Eyebrow } from '@components/ui'

type ShopFiltersPanelProps = {
  filters: ShopFiltersType
  setFilter: (key: string, value?: string | number | boolean | null) => void
  clearFilters: () => void
  open: boolean
  onClose: () => void
  hideCategory?: boolean
}

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'skin-care', label: 'Skin Care' },
  { value: 'body-care', label: 'Body Care' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'essential-oils', label: 'Essential Oils' },
  { value: 'cold-pressed-oils', label: 'Cold Pressed Oils' },
  { value: 'combos', label: 'Combos' },
]

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="border-b border-charcoal/10 py-5">
      <Eyebrow tone="gold" className="mb-4">
        {title}
      </Eyebrow>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'mr-2 mb-2 inline-flex rounded-full border px-3 py-1.5 text-micro transition-colors',
        active
          ? 'border-forest bg-forest text-warm-white'
          : 'border-charcoal/15 text-charcoal hover:border-forest',
      )}
    >
      {children}
    </button>
  )
}

export function ShopFiltersPanel({
  filters,
  setFilter,
  clearFilters,
  open,
  onClose,
  hideCategory,
}: ShopFiltersPanelProps) {
  const ingredients = getUniqueIngredients()

  const content = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 text-micro text-forest">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="text-micro text-olive hover:text-forest"
        >
          Clear all
        </button>
      </div>

      {!hideCategory && (
        <FilterGroup title="Category">
          <div>
            {categories.map((cat) => (
              <Chip
                key={cat.value}
                active={(filters.category ?? 'all') === cat.value}
                onClick={() =>
                  setFilter('category', cat.value === 'all' ? null : cat.value)
                }
              >
                {cat.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Gender">
        <div>
          {GENDER_OPTIONS.map((g) => (
            <Chip
              key={g.value}
              active={filters.gender === g.value}
              onClick={() =>
                setFilter(
                  'gender',
                  filters.gender === g.value ? null : g.value,
                )
              }
            >
              {g.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Concern">
        <div>
          {CONCERN_OPTIONS.map((c) => (
            <Chip
              key={c.value}
              active={filters.concern === c.value}
              onClick={() =>
                setFilter(
                  'concern',
                  filters.concern === c.value ? null : c.value,
                )
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Skin type">
        <div>
          {SKIN_OPTIONS.map((s) => (
            <Chip
              key={s.value}
              active={filters.skinType === s.value}
              onClick={() =>
                setFilter('skin', filters.skinType === s.value ? null : s.value)
              }
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Hair type">
        <div>
          {HAIR_OPTIONS.map((h) => (
            <Chip
              key={h.value}
              active={filters.hairType === h.value}
              onClick={() =>
                setFilter('hair', filters.hairType === h.value ? null : h.value)
              }
            >
              {h.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Ingredient">
        <div className="max-h-40 overflow-y-auto">
          {ingredients.slice(0, 16).map((ing) => (
            <Chip
              key={ing}
              active={filters.ingredient === ing}
              onClick={() =>
                setFilter(
                  'ingredient',
                  filters.ingredient === ing ? null : ing,
                )
              }
            >
              {ing}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex gap-3">
          <label className="flex-1 text-micro text-charcoal-muted">
            Min
            <input
              type="number"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                setFilter('min', e.target.value ? Number(e.target.value) : null)
              }
              className="mt-1 w-full border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-forest"
              placeholder="0"
            />
          </label>
          <label className="flex-1 text-micro text-charcoal-muted">
            Max
            <input
              type="number"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                setFilter('max', e.target.value ? Number(e.target.value) : null)
              }
              className="mt-1 w-full border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-forest"
              placeholder="2000"
            />
          </label>
        </div>
      </FilterGroup>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">{content}</aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[var(--z-overlay)] lg:hidden',
          open ? 'visible' : 'invisible',
        )}
      >
        <button
          type="button"
          aria-label="Close filters"
          className={cn(
            'absolute inset-0 bg-forest-deep/40 transition-opacity',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-cream p-6 shadow-[var(--shadow-lift)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          {content}
        </div>
      </div>
    </>
  )
}

import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { useCatalog } from '@contexts/CatalogContext'
import {
  CONCERN_OPTIONS,
  GENDER_OPTIONS,
  type ProductCategory,
  type ShopFilters as ShopFiltersType,
} from '@/types/shop'
import { getUniqueIngredients } from '@utils/shop'
import { cn } from '@utils/index'

type ShopFiltersPanelProps = {
  filters: ShopFiltersType
  setFilter: (key: string, value?: string | number | boolean | null) => void
  clearFilters: () => void
  open: boolean
  onClose: () => void
  hideCategory?: boolean
}

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'skin-care', label: 'Skin Care' },
  { value: 'body-care', label: 'Body Care' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'essential-oils', label: 'Essential Oils' },
  { value: 'cold-pressed-oils', label: 'Cold Pressed Oils' },
  { value: 'combos', label: 'Combos' },
]

const PRICE_MAX = 2000

function FilterSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('border-b border-charcoal/8 py-5', className)}>
      <p className="mb-3 text-[0.68rem] font-medium tracking-[0.18em] text-[#b8975c] uppercase">
        {title}
      </p>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] tracking-[0.02em] transition-all duration-300',
        active
          ? 'bg-forest text-warm-white shadow-[0_6px_16px_rgba(36,53,40,0.18)]'
          : 'bg-warm-white text-charcoal/75 ring-1 ring-charcoal/10 hover:ring-forest/35 hover:text-forest',
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'inline-flex min-w-[1.15rem] items-center justify-center rounded-full px-1 text-[0.62rem]',
            active ? 'bg-warm-white/20 text-warm-white' : 'bg-charcoal/6 text-charcoal/55',
          )}
        >
          {count}
        </span>
      )}
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
  const { products: catalog } = useCatalog()
  const ingredients = getUniqueIngredients(catalog)
  const [ingredientOpen, setIngredientOpen] = useState(false)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalog.length }
    for (const cat of categories) {
      if (cat.value === 'all') continue
      counts[cat.value] = catalog.filter((p) => p.category === cat.value).length
    }
    return counts
  }, [catalog])

  const concernCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of CONCERN_OPTIONS) {
      counts[c.value] = catalog.filter((p) => p.concerns.includes(c.value)).length
    }
    return counts
  }, [catalog])

  const minPrice = filters.minPrice ?? 0
  const maxPrice = filters.maxPrice ?? PRICE_MAX

  const content = (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.2em] text-forest uppercase">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
          Filters
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="text-[0.68rem] tracking-[0.14em] text-olive uppercase transition-colors hover:text-forest"
        >
          Clear all
        </button>
      </div>

      {!hideCategory && (
        <FilterSection title="Category" className="pt-4">
          <ul className="space-y-1">
            {categories.map((cat) => {
              const active = (filters.category ?? 'all') === cat.value
              return (
                <li key={cat.value}>
                  <button
                    type="button"
                    onClick={() =>
                      setFilter('category', cat.value === 'all' ? null : cat.value)
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-300',
                      active
                        ? 'bg-forest text-warm-white shadow-[0_10px_24px_rgba(36,53,40,0.16)]'
                        : 'text-charcoal/80 hover:bg-warm-white hover:text-forest',
                    )}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        'inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem]',
                        active
                          ? 'bg-warm-white/18 text-warm-white'
                          : 'bg-charcoal/6 text-charcoal/50',
                      )}
                    >
                      {categoryCounts[cat.value] ?? 0}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((g) => (
            <Chip
              key={g.value}
              active={filters.gender === g.value}
              onClick={() =>
                setFilter('gender', filters.gender === g.value ? null : g.value)
              }
            >
              {g.label}
            </Chip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Concern">
        <div className="flex flex-wrap gap-2">
          {CONCERN_OPTIONS.map((c) => (
            <Chip
              key={c.value}
              active={filters.concern === c.value}
              count={concernCounts[c.value]}
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
      </FilterSection>

      <div className="border-b border-charcoal/8 py-2">
        <button
          type="button"
          onClick={() => setIngredientOpen((v) => !v)}
          className="flex w-full items-center justify-between py-3 text-left"
          aria-expanded={ingredientOpen}
        >
          <span className="text-[0.68rem] font-medium tracking-[0.18em] text-[#b8975c] uppercase">
            Ingredient
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-forest/70 transition-transform duration-300',
              ingredientOpen && 'rotate-180',
            )}
            strokeWidth={1.75}
          />
        </button>
        {ingredientOpen && (
          <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pb-4">
            {ingredients.slice(0, 20).map((ing) => (
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
                {ing.length > 28 ? `${ing.slice(0, 26)}…` : ing}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <FilterSection title="Price range" className="border-b-0">
        <div className="space-y-4">
          <div className="relative h-6">
            <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-charcoal/10" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-forest"
              style={{
                left: `${(minPrice / PRICE_MAX) * 100}%`,
                right: `${100 - (maxPrice / PRICE_MAX) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={25}
              value={minPrice}
              aria-label="Minimum price"
              onChange={(e) => {
                const next = Math.min(Number(e.target.value), maxPrice - 25)
                setFilter('min', next <= 0 ? null : next)
              }}
              className="shop-range absolute inset-0 z-20 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={25}
              value={maxPrice}
              aria-label="Maximum price"
              onChange={(e) => {
                const next = Math.max(Number(e.target.value), minPrice + 25)
                setFilter('max', next >= PRICE_MAX ? null : next)
              }}
              className="shop-range absolute inset-0 z-30 w-full appearance-none bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between text-[0.78rem] text-charcoal/70">
            <span>₹{minPrice}</span>
            <span>{maxPrice >= PRICE_MAX ? '₹2000+' : `₹${maxPrice}`}</span>
          </div>
        </div>
      </FilterSection>
    </>
  )

  return (
    <>
      <aside className="shop-filters-panel hidden lg:block lg:w-[17.5rem] lg:shrink-0">
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          className="shop-filters-scroll sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-2xl bg-[#efeae0]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-charcoal/5 backdrop-blur-sm"
        >
          {content}
        </div>
      </aside>

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
            'shop-filters-scroll absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto overscroll-contain bg-[#f7f3eb] p-6 shadow-[var(--shadow-lift)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
          data-lenis-prevent
          data-lenis-prevent-wheel
        >
          <div className="mb-2 flex justify-end">
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

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  CircleDot,
  Clock,
  Droplet,
  Droplets,
  Eye,
  Flower2,
  Leaf,
  Search,
  Snowflake,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useCatalog } from '@contexts/CatalogContext'
import { concernPages } from '@/data/concerns'
import { botanicals } from '@/data/botanicals'
import { ROUTES } from '@/routes/paths'
import { ProductImage } from '@components/ui'
import { cn } from '@utils/index'
import { fuzzyRank } from '@utils/fuzzy'

type PredictiveSearchProps = {
  open: boolean
  onClose: () => void
}

const concernIcons: Record<string, LucideIcon> = {
  acne: CircleDot,
  'oily-skin': Droplet,
  pigmentation: Sun,
  hairfall: Wind,
  dandruff: Snowflake,
  'dark-circles': Eye,
  'sensitive-skin': Flower2,
  dryness: Droplets,
  dullness: Clock,
}

const botanicalIcons: Record<string, LucideIcon> = {
  charcoal: Sparkles,
  'black-cumin': Sprout,
  'carrot-seed': Leaf,
  coffee: Droplet,
  'cucumber-seed': Droplets,
  eucalyptus: Leaf,
  'goat-milk': Droplet,
  jojoba: Sprout,
  lavender: Flower2,
  peach: Sun,
  'tea-tree': Leaf,
  'watermelon-seed-oil': Droplets,
  'wild-apricot': Sun,
}

function SectionHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-soft-gold/35 bg-[#f4eee1] text-forest">
        <Icon className="h-3 w-3" strokeWidth={1.6} />
      </span>
      <p className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-forest">
        {label}
      </p>
    </div>
  )
}

function Chip({
  to,
  onClick,
  icon: Icon,
  label,
  trailing,
}: {
  to: string
  onClick: () => void
  icon?: LucideIcon
  label: string
  trailing?: boolean
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-forest/12 bg-white/70 px-3 py-1.5',
        'text-[0.76rem] font-light text-forest transition duration-300',
        'hover:border-soft-gold/60 hover:bg-white hover:shadow-[0_6px_18px_rgba(23,55,40,0.06)]',
      )}
    >
      {Icon && <Icon className="h-3 w-3 text-forest/70" strokeWidth={1.5} />}
      {label}
      {trailing && (
        <ChevronRight className="h-3 w-3 text-forest/50" strokeWidth={1.6} />
      )}
    </Link>
  )
}

export function PredictiveSearch({ open, onClose }: PredictiveSearchProps) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { products } = useCatalog()

  useEffect(() => {
    if (open) {
      setQ('')
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const query = q.trim()
    if (!query) {
      return {
        products: products.filter((p) => p.isBestSeller).slice(0, 4),
        concerns: concernPages.slice(0, 4),
        botanicals: botanicals.slice(0, 4),
      }
    }

    return {
      products: fuzzyRank(
        query,
        products,
        (p) => [
          { value: p.title },
          { value: p.ingredients.join(' '), weight: 0.9 },
          { value: p.tags.join(' '), weight: 0.8 },
          { value: p.category.replace(/-/g, ' '), weight: 0.7 },
        ],
        { limit: 6 },
      ),
      concerns: fuzzyRank(
        query,
        concernPages,
        (c) => [{ value: c.title }, { value: c.headline, weight: 0.7 }],
        { limit: 4 },
      ),
      botanicals: fuzzyRank(
        query,
        botanicals,
        (b) => [{ value: b.name }, { value: b.latin, weight: 0.85 }],
        { limit: 4 },
      ),
    }
  }, [q, products])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    onClose()
    navigate(query ? `${ROUTES.search}?q=${encodeURIComponent(query)}` : ROUTES.search)
  }

  const empty =
    results.products.length === 0 &&
    results.concerns.length === 0 &&
    results.botanicals.length === 0

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] flex items-start justify-center bg-[#1b261e]/55 px-4 pt-[7vh] backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close search"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/60 bg-[#FBF8F1] shadow-[0_36px_90px_rgba(20,32,24,0.32)]">
        {/* Search bar */}
        <form
          onSubmit={submit}
          className="flex items-center gap-3 px-5 pt-4 pb-3 md:px-6 md:pt-5"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-soft-gold/45 bg-white/75 px-4 py-2.5 transition focus-within:border-soft-gold focus-within:bg-white focus-within:ring-4 focus-within:ring-soft-gold/12">
            <Search className="h-4 w-4 shrink-0 text-forest/70" strokeWidth={1.6} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, concerns, botanicals…"
              /* wrapper carries the visible focus ring */
              style={{ outline: 'none' }}
              className="w-full bg-transparent text-[0.9rem] font-light text-charcoal placeholder:text-charcoal-muted/55"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/10 bg-[#f2ece1] text-forest transition hover:border-soft-gold/60 hover:bg-white"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.7} />
          </button>
        </form>

        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          className="max-h-[72vh] overflow-y-auto overscroll-contain px-5 pb-5 md:px-6"
        >
          {empty && (
            <p className="py-12 text-center text-[0.9rem] font-light text-charcoal-muted">
              No matches yet — try a product, concern, or botanical.
            </p>
          )}

          {results.products.length > 0 && (
            <section className="border-t border-forest/8 pt-3.5">
              <SectionHeader icon={Star} label={q ? 'Matches' : 'Popular'} />

              <ul className="mt-1.5">
                {results.products.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.slug}`}
                      onClick={onClose}
                      className={cn(
                        'group flex items-center gap-4 rounded-xl px-2.5 py-2 transition-colors duration-300',
                        'hover:bg-[#f3ede1]',
                        i > 0 && 'border-t border-forest/8',
                      )}
                    >
                      <ProductImage
                        src={p.images[0]?.url ?? ''}
                        alt=""
                        size="card"
                        className="h-12 w-[4.5rem] shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[1.05rem] leading-tight text-forest">
                          {p.title}
                        </p>
                        <p className="mt-0.5 text-[0.62rem] font-medium tracking-[0.18em] uppercase text-soft-gold">
                          {p.category.replace(/-/g, ' ')}
                        </p>
                      </div>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe8db] text-forest transition duration-300 group-hover:bg-white group-hover:shadow-[0_6px_16px_rgba(23,55,40,0.08)]">
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.concerns.length > 0 && (
            <section className="mt-3.5 border-t border-forest/8 pt-3.5">
              <SectionHeader icon={Sprout} label="Concerns" />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {results.concerns.map((c) => (
                  <Chip
                    key={c.slug}
                    to={`${ROUTES.concerns}/${c.slug}`}
                    onClick={onClose}
                    icon={concernIcons[c.slug] ?? Leaf}
                    label={c.title}
                  />
                ))}
              </div>
            </section>
          )}

          {results.botanicals.length > 0 && (
            <section className="mt-3.5 border-t border-forest/8 pt-3.5">
              <SectionHeader icon={Leaf} label="Ingredients" />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {results.botanicals.map((b) => (
                  <Chip
                    key={b.slug}
                    to={`${ROUTES.ingredients}/${b.slug}`}
                    onClick={onClose}
                    icon={botanicalIcons[b.slug] ?? Leaf}
                    label={b.name}
                  />
                ))}
                <Chip
                  to={ROUTES.ingredients}
                  onClick={onClose}
                  label="View all"
                  trailing
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

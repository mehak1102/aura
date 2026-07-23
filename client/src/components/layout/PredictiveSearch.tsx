import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useCatalog } from '@contexts/CatalogContext'
import { concernPages } from '@/data/concerns'
import { botanicals } from '@/data/botanicals'
import { ROUTES } from '@/routes/paths'
import { ProductImage } from '@components/ui'
import { cn } from '@utils/index'

type PredictiveSearchProps = {
  open: boolean
  onClose: () => void
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

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 1) {
      return {
        products: products.filter((p) => p.isBestSeller).slice(0, 4),
        concerns: concernPages.slice(0, 4),
        botanicals: botanicals.slice(0, 4),
      }
    }
    return {
      products: products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.ingredients.some((i) => i.toLowerCase().includes(query)) ||
            p.tags.some((t) => t.toLowerCase().includes(query)),
        )
        .slice(0, 6),
      concerns: concernPages
        .filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.headline.toLowerCase().includes(query),
        )
        .slice(0, 4),
      botanicals: botanicals
        .filter(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.latin.toLowerCase().includes(query),
        )
        .slice(0, 4),
    }
  }, [q, products])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    onClose()
    navigate(query ? `${ROUTES.search}?q=${encodeURIComponent(query)}` : ROUTES.search)
  }

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] flex items-start justify-center bg-[#1b261e]/55 px-4 pt-[12vh] backdrop-blur-sm">
      <button type="button" className="absolute inset-0" aria-label="Close search" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-[#F8F5EE] shadow-2xl">
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-charcoal/10 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, concerns, botanicals…"
            className="w-full bg-transparent text-base text-charcoal outline-none placeholder:text-charcoal/40"
          />
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-charcoal/60" />
          </button>
        </form>

        <div className="max-h-[55vh] overflow-y-auto p-5">
          <p className="text-micro tracking-[0.16em] uppercase text-olive">
            {q ? 'Matches' : 'Popular'}
          </p>

          {results.products.length > 0 && (
            <div className="mt-4 space-y-2">
              {results.products.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-warm-white"
                >
                  <ProductImage
                    src={p.images[0]?.url ?? ''}
                    alt=""
                    size="card"
                    className="h-14 w-14 object-contain"
                  />
                  <div>
                    <p className="font-display text-lg text-forest">{p.title}</p>
                    <p className="text-micro text-olive">{p.category.replace(/-/g, ' ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.concerns.length > 0 && (
            <div className="mt-6">
              <p className="text-micro text-charcoal/50">Concerns</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {results.concerns.map((c) => (
                  <Link
                    key={c.slug}
                    to={`${ROUTES.concerns}/${c.slug}`}
                    onClick={onClose}
                    className={cn(
                      'border border-charcoal/15 px-3 py-1.5 text-micro text-forest hover:border-forest',
                    )}
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.botanicals.length > 0 && (
            <div className="mt-6">
              <p className="text-micro text-charcoal/50">Ingredients</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {results.botanicals.map((b) => (
                  <Link
                    key={b.slug}
                    to={`${ROUTES.ingredients}/${b.slug}`}
                    onClick={onClose}
                    className="border border-charcoal/15 px-3 py-1.5 text-micro text-forest hover:border-forest"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ShopView } from '@components/shop'
import { Button } from '@components/ui'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [draft, setDraft] = useState(initial)

  return (
    <>
      <div className="container-aura pt-28 md:pt-32">
        <form
          className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            setParams(draft.trim() ? { q: draft.trim() } : {}, { replace: true })
          }}
        >
          <label className="flex-1">
            <span className="text-micro text-charcoal-muted">Search</span>
            <div className="mt-2 flex items-center gap-3 border-b border-charcoal/20 focus-within:border-forest">
              <Search className="h-4 w-4 text-olive" strokeWidth={1.5} />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Tea tree, charcoal, hair oil…"
                className="w-full bg-transparent py-3 text-lg outline-none"
                autoFocus
              />
            </div>
          </label>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <ShopView
        metaKey="all"
        title={initial ? `Results for “${initial}”` : 'Search'}
        eyebrow="Find a ritual"
        description={
          initial
            ? 'Matching botanicals from across the atelier.'
            : 'Search by product, ingredient, or concern.'
        }
        defaults={{ query: initial || undefined }}
        seoTitle={initial ? `Search: ${initial}` : 'Search'}
      />
    </>
  )
}

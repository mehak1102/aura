import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Card } from '@components/ui'
import { adminApi } from '@services/api/admin'

export default function MediaLibraryPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: () => adminApi.media(),
  })

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading media…</div>
  }

  return (
    <div>
      <PageHeader
        title="Media library"
        description="Product images from the catalog — click to copy URL."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden p-0">
            <button
              type="button"
              onClick={() => copyUrl(asset.url)}
              className="block w-full text-left"
            >
              <div className="aspect-square overflow-hidden bg-cream">
                <img
                  src={asset.url}
                  alt={asset.alt}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-forest">
                  {asset.productTitle}
                </p>
                <p className="mt-1 truncate text-[0.65rem] text-charcoal/55">
                  {copied === asset.url ? 'Copied!' : asset.alt}
                </p>
              </div>
            </button>
          </Card>
        ))}
      </div>

      {!assets.length && (
        <Card className="text-center text-sm text-charcoal/60">
          No media assets found in the catalog.
        </Card>
      )}
    </div>
  )
}

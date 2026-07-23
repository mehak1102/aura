import { PageHeader } from './PageHeader'

export function PagePlaceholder({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed border-charcoal/15 bg-white px-6 py-20 text-center">
        <p className="font-display text-xl text-forest">Coming in a later phase</p>
        <p className="mt-2 text-sm text-charcoal/60">
          This module is scaffolded and will connect to backend workflows soon.
        </p>
      </div>
    </div>
  )
}

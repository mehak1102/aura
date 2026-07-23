import { cn } from '@utils/index'
import type { HTMLAttributes } from 'react'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.2em] text-olive">{label}</p>
      <p className="mt-2 font-display text-3xl text-forest">{value}</p>
      {hint && <p className="mt-1 text-sm text-charcoal/60">{hint}</p>}
    </Card>
  )
}

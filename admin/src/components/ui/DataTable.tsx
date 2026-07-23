import { cn } from '@utils/index'

type Column<T> = {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
  getRowKey: (row: T) => string
}

export function DataTable<T>({
  columns,
  rows,
  emptyMessage = 'No records yet.',
  getRowKey,
}: DataTableProps<T>) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-charcoal/15 bg-white px-6 py-16 text-center text-sm text-charcoal/60">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-charcoal/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-charcoal/10 bg-cream/60 text-xs uppercase tracking-wide text-olive">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 font-medium', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3', col.className)}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

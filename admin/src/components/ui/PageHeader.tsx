type PageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-olive">Admin</p>
        <h1 className="mt-2 font-display text-3xl text-forest">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-charcoal/65">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

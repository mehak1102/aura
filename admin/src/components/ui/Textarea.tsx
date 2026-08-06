import { cn } from '@utils/index'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-charcoal/70">
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        className={cn(
          'min-h-[96px] w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-forest',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

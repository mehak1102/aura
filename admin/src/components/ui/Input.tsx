import { cn } from '@utils/index'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-charcoal/70">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-forest',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

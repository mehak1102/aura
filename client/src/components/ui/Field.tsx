import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@utils/index'

const fieldBase =
  'w-full bg-transparent border-0 border-b border-charcoal/20 px-0 py-3 text-body font-light text-charcoal placeholder:text-charcoal-muted/60 transition-colors duration-300 focus:border-forest focus:outline-none'

type FieldLabelProps = {
  label: string
  htmlFor?: string
  error?: string
}

function FieldMeta({ label, htmlFor, error }: FieldLabelProps) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4">
      <label htmlFor={htmlFor} className="text-micro text-charcoal-muted">
        {label}
      </label>
      {error && <span className="text-micro text-olive">{error}</span>}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, ...props }, ref) {
    const inputId = id ?? props.name
    return (
      <div className="w-full">
        <FieldMeta label={label} htmlFor={inputId} error={error} />
        <input
          ref={ref}
          id={inputId}
          className={cn(
            fieldBase,
            error && 'border-olive',
            props.disabled && 'opacity-60 cursor-not-allowed',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, id, ...props }, ref) {
    const inputId = id ?? props.name
    return (
      <div className="w-full">
        <FieldMeta label={label} htmlFor={inputId} error={error} />
        <textarea
          ref={ref}
          id={inputId}
          className={cn(fieldBase, 'min-h-32 resize-y', error && 'border-olive', className)}
          {...props}
        />
      </div>
    )
  },
)

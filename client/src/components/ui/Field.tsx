import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@utils/index'

const fieldBase =
  'w-full bg-transparent border-0 border-b border-charcoal/20 px-0 py-3 text-body font-light text-charcoal placeholder:text-charcoal-muted/60 transition-colors duration-300 focus:border-forest focus:outline-none'

const boxedBase =
  'w-full h-10 rounded-[var(--radius-md)] border border-charcoal/12 bg-warm-white/70 px-3 py-0 text-[0.8125rem] font-light leading-none text-charcoal placeholder:text-charcoal-muted/60 transition-colors duration-300 focus:border-soft-gold/70 focus:outline-none'

/** `boxed` adds a bordered field with room for a leading icon (checkout, forms) */
type FieldVariant = 'underline' | 'boxed'

type FieldLabelProps = {
  label: string
  htmlFor?: string
  error?: string
  variant?: FieldVariant
  required?: boolean
}

function FieldMeta({
  label,
  htmlFor,
  error,
  variant,
  required,
}: FieldLabelProps) {
  const boxed = variant === 'boxed'
  return (
    <div className="mb-1.5 flex items-end justify-between gap-4">
      <label
        htmlFor={htmlFor}
        className={cn(
          boxed
            ? 'text-[0.68rem] text-charcoal/55'
            : 'text-micro text-charcoal-muted',
        )}
      >
        {label}
        {required && (
          <span className="ml-0.5 text-soft-gold" aria-hidden>
            *
          </span>
        )}
      </label>
      {/* Boxed fields show the error under the field instead */}
      {error && !boxed && (
        <span className="text-micro text-olive">{error}</span>
      )}
    </div>
  )
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 text-[0.72rem] text-[#b4534b]">
      {message}
    </p>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  variant?: FieldVariant
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, className, id, variant = 'underline', icon, ...props },
    ref,
  ) {
    const inputId = id ?? props.name
    const boxed = variant === 'boxed'
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        <FieldMeta
          label={label}
          htmlFor={inputId}
          error={error}
          variant={variant}
          required={props.required}
        />
        <div className={cn(boxed && 'relative')}>
          {boxed && icon && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35 [&>svg]:h-3.5 [&>svg]:w-3.5"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              boxed ? boxedBase : fieldBase,
              boxed && Boolean(icon) && 'pl-9',
              error && (boxed ? 'border-[#b4534b]/55' : 'border-olive'),
              props.disabled && 'opacity-60 cursor-not-allowed',
              className,
            )}
            {...props}
          />
        </div>
        {error && boxed && <FieldError id={errorId} message={error} />}
      </div>
    )
  },
)

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  variant?: FieldVariant
  icon?: ReactNode
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, className, id, variant = 'underline', icon, ...props },
    ref,
  ) {
    const inputId = id ?? props.name
    const boxed = variant === 'boxed'
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        <FieldMeta
          label={label}
          htmlFor={inputId}
          error={error}
          variant={variant}
          required={props.required}
        />
        <div className={cn(boxed && 'relative')}>
          {boxed && icon && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 text-charcoal/35 [&>svg]:h-3.5 [&>svg]:w-3.5"
            >
              {icon}
            </span>
          )}
          <textarea
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              boxed ? boxedBase : fieldBase,
              boxed ? 'h-auto min-h-20 resize-y py-2.5' : 'min-h-32 resize-y',
              boxed && Boolean(icon) && 'pl-9',
              error && (boxed ? 'border-[#b4534b]/55' : 'border-olive'),
              className,
            )}
            {...props}
          />
        </div>
        {error && boxed && <FieldError id={errorId} message={error} />}
      </div>
    )
  },
)

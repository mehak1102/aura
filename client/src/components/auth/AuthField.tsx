import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { cn } from '@utils/index'

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  icon: LucideIcon
  error?: string
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ label, icon: Icon, error, className, id, type = 'text', ...props }, ref) {
    const [revealed, setRevealed] = useState(false)
    const inputId = id ?? props.name
    const isPassword = type === 'password'
    const resolvedType = isPassword && revealed ? 'text' : type

    return (
      <div className="w-full">
        <div className="mb-2 flex items-end justify-between gap-4">
          <label
            htmlFor={inputId}
            className="text-[0.62rem] font-medium tracking-[0.2em] text-charcoal/55 uppercase"
          >
            {label}
          </label>
          {error && (
            <span className="text-[0.68rem] font-light text-[#a8543f]">{error}</span>
          )}
        </div>

        <div
          className={cn(
            'flex items-center gap-3 rounded-full border bg-white/60 px-4 transition-colors duration-300',
            'focus-within:border-[#b8975c] focus-within:bg-white',
            error ? 'border-[#a8543f]/50' : 'border-[#c4a35a]/45',
          )}
        >
          <Icon className="h-4 w-4 shrink-0 text-[#b8975c]" strokeWidth={1.75} aria-hidden />

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              'h-12 w-full min-w-0 bg-transparent text-[0.9rem] font-light text-forest',
              'placeholder:text-charcoal/35 focus:outline-none',
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              className="shrink-0 text-charcoal/40 transition-colors hover:text-[#b8975c]"
            >
              {revealed ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
      </div>
    )
  },
)

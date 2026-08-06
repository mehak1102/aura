import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send } from 'lucide-react'
import { Body } from '@components/ui'
import { cn } from '@utils/index'
import { api } from '@services/api/client'
import { API_ENDPOINTS } from '@services/api/endpoints'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactInput = z.infer<typeof contactSchema>

const SUBJECTS = [
  'Product question',
  'Order support',
  'Custom ritual advice',
  'Wholesale & stockists',
  'Something else',
]

const fieldBase =
  'w-full rounded-xl border border-forest/12 bg-white/70 px-4 py-3 text-[0.92rem] font-light text-charcoal placeholder:text-charcoal-muted/55 shadow-[0_1px_2px_rgba(23,55,40,0.03)] transition duration-300 focus:border-soft-gold focus:bg-white focus:outline-none focus:ring-4 focus:ring-soft-gold/12'

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="text-[0.62rem] font-medium tracking-[0.18em] uppercase text-charcoal-muted"
        >
          {label}
        </label>
        {error && (
          <span id={`${htmlFor}-error`} className="text-micro text-olive" role="alert">
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await api.post(API_ENDPOINTS.contact.submit, values)
      setSent(true)
      reset()
    } catch (err: unknown) {
      let message = 'Could not send your message. Please try again.'
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response
          ?.data?.message === 'string'
      ) {
        message = (err as { response: { data: { message: string } } }).response
          .data.message
      } else if (err instanceof Error && err.message) {
        message = err.message
      }
      setSubmitError(message)
    }
  })

  if (sent) {
    return (
      <div className="rounded-2xl border border-forest/12 bg-white/70 p-8 text-center shadow-[0_16px_40px_rgba(23,55,40,0.06)] backdrop-blur-sm">
        <Body className="text-forest">
          Thank you — we have received your message and will respond within one
          business day.
        </Body>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-micro text-charcoal-muted underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FieldShell label="Name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          autoComplete="name"
          placeholder="Your full name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={cn(fieldBase, errors.name && 'border-olive/60')}
          {...register('name')}
        />
      </FieldShell>

      <FieldShell label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn(fieldBase, errors.email && 'border-olive/60')}
          {...register('email')}
        />
      </FieldShell>

      <FieldShell
        label="Subject"
        htmlFor="subject"
        error={errors.subject?.message}
      >
        <select
          id="subject"
          defaultValue=""
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={cn(
            fieldBase,
            'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10',
            errors.subject && 'border-olive/60',
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b655c' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          }}
          {...register('subject')}
        >
          <option value="" disabled>
            What is this regarding?
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Message"
        htmlFor="message"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={5}
          placeholder="Type your message here..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(
            fieldBase,
            'min-h-32 resize-y',
            errors.message && 'border-olive/60',
          )}
          {...register('message')}
        />
      </FieldShell>

      {submitError && (
        <p className="text-sm text-olive" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'group inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5',
          'text-[0.63rem] font-semibold tracking-[0.2em] uppercase text-warm-white',
          'shadow-[0_12px_28px_rgba(23,55,40,0.18)] transition duration-300',
          'hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        <Send
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={1.8}
        />
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

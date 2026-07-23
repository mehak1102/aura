import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Textarea, MagneticButton, Body } from '@components/ui'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactInput = z.infer<typeof contactSchema>

export function ContactForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    reset()
  })

  if (sent) {
    return (
      <div className="rounded-sm border border-forest/15 bg-cream p-8 text-center">
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
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Input
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Subject"
        error={errors.subject?.message}
        {...register('subject')}
      />
      <Textarea
        label="Message"
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />
      <MagneticButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </MagneticButton>
    </form>
  )
}

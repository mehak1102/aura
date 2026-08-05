import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { AuthShell } from '@components/auth/AuthShell'
import { AuthField } from '@components/auth/AuthField'
import { useAuth } from '@contexts/AuthContext'
import { registerSchema, type RegisterInput } from '@/lib/authSchemas'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await registerUser(values)
      navigate(ROUTES.account, { replace: true })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Unable to create account. Please try again.'
      setFormError(message)
    }
  })

  return (
    <>
      <Seo title="Create Account" description="Join Aura of Nature." noindex />
      <AuthShell
        eyebrow="Join the circle"
        title="Create account"
        description="Save favorites, track orders, and receive botanical notes."
      >
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <AuthField
            label="Full name"
            icon={UserRound}
            autoComplete="name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <AuthField
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <AuthField
            label="Phone (optional)"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="+91 00000 00000"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <AuthField
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <AuthField
            label="Confirm password"
            icon={ShieldCheck}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {formError && (
            <p className="rounded-lg border border-[#a8543f]/30 bg-[#a8543f]/5 px-3.5 py-2.5 text-[0.8rem] font-light text-[#a8543f]">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-full bg-forest text-[0.7rem] font-medium tracking-[0.22em] text-warm-white uppercase transition-colors duration-300 hover:bg-forest-deep disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4" aria-hidden>
          <span className="h-px flex-1 bg-[#c4a35a]/30" />
          <span className="text-[0.6rem] tracking-[0.24em] text-charcoal/40 uppercase">
            or
          </span>
          <span className="h-px flex-1 bg-[#c4a35a]/30" />
        </div>

        <Link
          to={ROUTES.login}
          className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#c4a35a]/60 bg-white/40 text-[0.7rem] font-medium tracking-[0.2em] text-forest uppercase transition-colors duration-300 hover:border-[#b8975c] hover:bg-white"
        >
          <UserRound className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          Sign in instead
        </Link>
      </AuthShell>
    </>
  )
}

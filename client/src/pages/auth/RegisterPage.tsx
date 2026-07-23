import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthShell } from '@components/auth/AuthShell'
import { Input, MagneticButton, Body } from '@components/ui'
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
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <Input
            label="Full name"
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
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {formError && (
            <Body size="sm" className="text-olive">
              {formError}
            </Body>
          )}

          <MagneticButton type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create Account'}
          </MagneticButton>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="text-forest underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </AuthShell>
    </>
  )
}

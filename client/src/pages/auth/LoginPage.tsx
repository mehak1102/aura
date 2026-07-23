import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthShell } from '@components/auth/AuthShell'
import { Input, MagneticButton, TextLink, Body } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { loginSchema, type LoginInput } from '@/lib/authSchemas'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const from =
    (location.state as { from?: string } | null)?.from || ROUTES.account

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Unable to sign in. Please try again.'
      setFormError(message)
    }
  })

  return (
    <>
      <Seo title="Sign In" description="Sign in to your Aura of Nature account." noindex />
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in"
        description="Access your orders, wishlist, and saved rituals."
      >
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <TextLink to={ROUTES.forgotPassword}>Forgot password</TextLink>
          </div>

          {formError && (
            <Body size="sm" className="text-olive">
              {formError}
            </Body>
          )}

          <MagneticButton type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </MagneticButton>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          New here?{' '}
          <Link to={ROUTES.register} className="text-forest underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </AuthShell>
    </>
  )
}

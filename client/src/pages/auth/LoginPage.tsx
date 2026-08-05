import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Leaf, Lock, Mail } from 'lucide-react'
import { AuthShell } from '@components/auth/AuthShell'
import { AuthField } from '@components/auth/AuthField'
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
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link
              to={ROUTES.forgotPassword}
              className="text-[0.78rem] font-light text-[#b8975c] underline-offset-4 transition-colors hover:text-[#96763f] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {formError && (
            <p className="rounded-lg border border-[#a8543f]/30 bg-[#a8543f]/5 px-3.5 py-2.5 text-[0.8rem] font-light text-[#a8543f]">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest text-[0.72rem] font-medium tracking-[0.24em] text-warm-white uppercase transition-colors duration-300 hover:bg-forest-deep disabled:pointer-events-none disabled:opacity-50"
          >
            <Leaf className="h-4 w-4 text-[#c2a378]" strokeWidth={1.6} aria-hidden />
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            <ArrowRight
              className="absolute right-6 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        </form>

        <div className="mt-8 border-t border-[#c4a35a]/25 pt-6 text-center">
          <p className="text-[0.86rem] font-light text-charcoal/60">
            New here?{' '}
            <Link
              to={ROUTES.register}
              className="font-medium text-forest underline underline-offset-4 transition-colors hover:text-[#96763f]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </AuthShell>
    </>
  )
}

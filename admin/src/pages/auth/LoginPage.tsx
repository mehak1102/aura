import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { ADMIN_ROUTES } from '@/routes/paths'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin, mustChangePassword } = useAuth()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const from = (location.state as { from?: string } | null)?.from

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated && isAdmin) {
    if (mustChangePassword) {
      return <Navigate to={ADMIN_ROUTES.changePassword} replace />
    }
    return <Navigate to={from || ADMIN_ROUTES.dashboard} replace />
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    try {
      await login(values.email, values.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    }
  })

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-olive">Aura of Nature</p>
        <h1 className="mt-2 font-display text-3xl text-forest">Admin sign in</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Use your admin credentials to manage the store.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
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
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@components/ui'
import { useAuth } from '@contexts/AuthContext'
import { ADMIN_ROUTES } from '@/routes/paths'

const schema = z
  .object({
    currentPassword: z.string().min(8, 'Enter your current password'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your new password'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: 'Choose a different password from the current one',
    path: ['newPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ChangePasswordPage() {
  const { changePassword, logout, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    try {
      await changePassword(values.currentPassword, values.newPassword)
      navigate(ADMIN_ROUTES.dashboard, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password')
    }
  })

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-olive">Aura of Nature</p>
        <h1 className="mt-2 font-display text-3xl text-forest">Change password</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          {user?.email
            ? `Signed in as ${user.email}. Set a new password to continue.`
            : 'Set a new password to continue using the admin panel.'}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            logout()
            navigate(ADMIN_ROUTES.login, { replace: true })
          }}
          className="mt-6 text-xs text-charcoal/50 underline-offset-2 hover:underline"
        >
          Sign out instead
        </button>
      </div>
    </div>
  )
}

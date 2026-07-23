import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthShell } from '@components/auth/AuthShell'
import { Input, MagneticButton, Body } from '@components/ui'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/lib/authSchemas'
import { authApi } from '@services/api/auth'
import { useAuth } from '@contexts/AuthContext'
import { ROUTES } from '@/routes/paths'
import { Seo } from '@components/seo/Seo'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [devToken, setDevToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const requestForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: '', password: '', confirmPassword: '' },
  })

  const onRequest = requestForm.handleSubmit(async (values) => {
    setFormError(null)
    setMessage(null)
    try {
      const res = await authApi.forgotPassword(values)
      setMessage(res.message || 'Check your inbox for reset instructions.')
      if (res.resetToken) {
        setDevToken(res.resetToken)
        resetForm.setValue('token', res.resetToken)
        setStep('reset')
      }
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Unable to send reset email.'
      setFormError(msg)
    }
  })

  const onReset = resetForm.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await resetPassword(values)
      navigate(ROUTES.account, { replace: true })
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Unable to reset password.'
      setFormError(msg)
    }
  })

  return (
    <>
      <Seo title="Forgot Password" noindex />
      <AuthShell
        eyebrow="Account recovery"
        title={step === 'request' ? 'Forgot password' : 'Set new password'}
        description={
          step === 'request'
            ? 'Enter your email and we will send reset instructions.'
            : 'Choose a new password for your account.'
        }
      >
        {step === 'request' ? (
          <form onSubmit={onRequest} className="space-y-6" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={requestForm.formState.errors.email?.message}
              {...requestForm.register('email')}
            />
            {message && (
              <Body size="sm" className="text-forest">
                {message}
              </Body>
            )}
            {devToken && (
              <Body size="sm" muted>
                Dev token ready — continue to set a new password.
              </Body>
            )}
            {formError && (
              <Body size="sm" className="text-olive">
                {formError}
              </Body>
            )}
            <MagneticButton
              type="submit"
              fullWidth
              disabled={requestForm.formState.isSubmitting}
            >
              {requestForm.formState.isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </MagneticButton>
          </form>
        ) : (
          <form onSubmit={onReset} className="space-y-6" noValidate>
            <Input
              label="Reset token"
              error={resetForm.formState.errors.token?.message}
              {...resetForm.register('token')}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              error={resetForm.formState.errors.password?.message}
              {...resetForm.register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={resetForm.formState.errors.confirmPassword?.message}
              {...resetForm.register('confirmPassword')}
            />
            {formError && (
              <Body size="sm" className="text-olive">
                {formError}
              </Body>
            )}
            <MagneticButton
              type="submit"
              fullWidth
              disabled={resetForm.formState.isSubmitting}
            >
              {resetForm.formState.isSubmitting ? 'Saving…' : 'Update Password'}
            </MagneticButton>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          <Link to={ROUTES.login} className="text-forest underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    </>
  )
}

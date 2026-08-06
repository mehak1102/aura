import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react'
import { AuthShell } from '@components/auth/AuthShell'
import { AuthField } from '@components/auth/AuthField'
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

const submitButton =
  'h-12 w-full rounded-full bg-forest text-[0.7rem] font-medium tracking-[0.22em] text-warm-white uppercase transition-colors duration-300 hover:bg-forest-deep disabled:pointer-events-none disabled:opacity-50'

export default function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const urlToken = params.get('token')?.trim() || ''

  const [step, setStep] = useState<'request' | 'reset'>(
    urlToken ? 'reset' : 'request',
  )
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
    defaultValues: {
      token: urlToken,
      password: '',
      confirmPassword: '',
    },
  })

  // Email links land on /auth/reset-password?token=… — jump straight to the form.
  useEffect(() => {
    if (!urlToken) return
    resetForm.setValue('token', urlToken)
    setStep('reset')
  }, [urlToken, resetForm])

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
      // Prefer opening the emailed link; also surface resetUrl in local/dev.
      if (res.resetUrl && !res.resetToken) {
        const tokenFromUrl = new URL(res.resetUrl).searchParams.get('token')
        if (tokenFromUrl) {
          setDevToken(tokenFromUrl)
          resetForm.setValue('token', tokenFromUrl)
          setStep('reset')
        }
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

  const errorNote = formError && (
    <p className="rounded-lg border border-[#a8543f]/30 bg-[#a8543f]/5 px-3.5 py-2.5 text-[0.8rem] font-light text-[#a8543f]">
      {formError}
    </p>
  )

  const hideTokenField = Boolean(urlToken)

  return (
    <>
      <Seo
        title={step === 'request' ? 'Forgot Password' : 'Reset Password'}
        noindex
      />
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
          <form onSubmit={onRequest} className="space-y-5" noValidate>
            <AuthField
              label="Email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={requestForm.formState.errors.email?.message}
              {...requestForm.register('email')}
            />

            {message && (
              <p className="rounded-lg border border-[#c4a35a]/40 bg-white/50 px-3.5 py-2.5 text-[0.8rem] font-light text-forest">
                {message}
              </p>
            )}
            {devToken && (
              <p className="text-[0.78rem] font-light text-charcoal/55">
                Dev token ready — continue to set a new password.
              </p>
            )}
            {errorNote}

            <button
              type="submit"
              disabled={requestForm.formState.isSubmitting}
              className={submitButton}
            >
              {requestForm.formState.isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <form onSubmit={onReset} className="space-y-5" noValidate>
            {hideTokenField ? (
              <input type="hidden" {...resetForm.register('token')} />
            ) : (
              <AuthField
                label="Reset token"
                icon={KeyRound}
                placeholder="Paste your token"
                error={resetForm.formState.errors.token?.message}
                {...resetForm.register('token')}
              />
            )}
            <AuthField
              label="New password"
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={resetForm.formState.errors.password?.message}
              {...resetForm.register('password')}
            />
            <AuthField
              label="Confirm password"
              icon={ShieldCheck}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={resetForm.formState.errors.confirmPassword?.message}
              {...resetForm.register('confirmPassword')}
            />
            {errorNote}

            <button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className={submitButton}
            >
              {resetForm.formState.isSubmitting ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}

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
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          Back to sign in
        </Link>
      </AuthShell>
    </>
  )
}

import { env } from '../config/env.js'

/** Fail closed in production when critical secrets are missing. */
export function assertProductionSecrets() {
  if (!env.isProd) return

  const missing = []
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-only-change-me') {
    missing.push('JWT_SECRET')
  }
  if (!process.env.MONGODB_URI) {
    missing.push('MONGODB_URI')
  }
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    missing.push('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET')
  }
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    missing.push('SMTP_HOST / SMTP_USER / SMTP_PASS')
  }
  if (
    !env.cloudinary.cloudName ||
    !env.cloudinary.apiKey ||
    !env.cloudinary.apiSecret
  ) {
    missing.push('CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET')
  }
  if (
    !process.env.CLIENT_URL ||
    /localhost|127\.0\.0\.1/i.test(env.clientUrl)
  ) {
    missing.push('CLIENT_URL (public storefront URL, not localhost)')
  }

  if (missing.length) {
    throw new Error(
      `Production misconfiguration — set: ${missing.join(', ')}`,
    )
  }
}

export function razorpayConfigured() {
  return Boolean(env.razorpay.keyId && env.razorpay.keySecret)
}

export function smtpConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass)
}

export function cloudinaryConfigured() {
  return Boolean(
    env.cloudinary.cloudName &&
      env.cloudinary.apiKey &&
      env.cloudinary.apiSecret,
  )
}

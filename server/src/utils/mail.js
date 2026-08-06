import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import { smtpConfigured } from './secrets.js'

let transporter

function getTransporter() {
  if (!smtpConfigured()) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    })
  }
  return transporter
}

/**
 * Send password-reset email. Never logs the raw token.
 * @returns {{ sent: boolean, reason?: string }}
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const mailer = getTransporter()
  if (!mailer) {
    return { sent: false, reason: 'smtp_not_configured' }
  }

  await mailer.sendMail({
    from: env.smtp.from,
    to,
    subject: 'Reset your Aura of Nature password',
    text: `Reset your password using this link (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>Reset your password using the link below. It expires in one hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  })

  return { sent: true }
}

export async function sendOrderConfirmationEmail({ to, orderId, total }) {
  const mailer = getTransporter()
  if (!mailer) return { sent: false, reason: 'smtp_not_configured' }

  try {
    await mailer.sendMail({
      from: env.smtp.from,
      to,
      subject: `Order confirmed · ${orderId}`,
      text: `Thank you for your order ${orderId}. Total: ₹${total}.`,
      html: `<p>Thank you for your order <strong>${orderId}</strong>.</p><p>Total: ₹${total}</p>`,
    })
    return { sent: true }
  } catch (err) {
    console.error('[mail] order confirmation failed', err?.message || err)
    return { sent: false, reason: 'send_failed' }
  }
}

export async function sendContactNotificationEmail({ to, inquiry }) {
  const mailer = getTransporter()
  if (!mailer) return { sent: false, reason: 'smtp_not_configured' }

  try {
    await mailer.sendMail({
      from: env.smtp.from,
      to,
      replyTo: inquiry.email,
      subject: `Contact · ${inquiry.subject}`,
      text: `From: ${inquiry.name} <${inquiry.email}>\nSubject: ${inquiry.subject}\n\n${inquiry.message}`,
      html: `
        <p><strong>${inquiry.name}</strong> &lt;${inquiry.email}&gt;</p>
        <p>Subject: ${inquiry.subject}</p>
        <p>${String(inquiry.message).replace(/\n/g, '<br/>')}</p>
      `,
    })
    return { sent: true }
  } catch (err) {
    console.error('[mail] contact notification failed', err?.message || err)
    return { sent: false, reason: 'send_failed' }
  }
}

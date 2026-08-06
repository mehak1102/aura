import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from './asyncHandler.js'

/** Short-lived proof that a guest may pay / view a specific order. */
export function signCheckoutToken({ orderNumber, email }) {
  return jwt.sign(
    {
      typ: 'checkout',
      orderNumber,
      email: String(email).toLowerCase().trim(),
    },
    env.jwtSecret,
    { expiresIn: '2h' },
  )
}

export function verifyCheckoutToken(token) {
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    if (payload.typ !== 'checkout' || !payload.orderNumber || !payload.email) {
      throw new Error('invalid')
    }
    return {
      orderNumber: payload.orderNumber,
      email: String(payload.email).toLowerCase().trim(),
    }
  } catch {
    throw new AppError('Invalid or expired checkout session', 403)
  }
}

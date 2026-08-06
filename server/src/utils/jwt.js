import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signToken(userId, role = 'customer') {
  // Admin sessions are short-lived; storefront can use the configured TTL.
  const expiresIn = role === 'admin' ? '4h' : env.jwtExpiresIn
  return jwt.sign({ sub: userId, role }, env.jwtSecret, {
    expiresIn,
  })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

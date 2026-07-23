import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signToken(userId, role = 'customer') {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

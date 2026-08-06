import { env } from '../config/env.js'

const COOKIE_NAME = 'token'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const ADMIN_MS = 4 * 60 * 60 * 1000

export function setAuthCookie(res, token, { role } = {}) {
  const maxAge = role === 'admin' ? ADMIN_MS : WEEK_MS
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge,
    path: '/',
  })
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/',
  })
}

export { COOKIE_NAME }

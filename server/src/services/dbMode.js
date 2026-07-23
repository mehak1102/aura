import { isDbReady } from '../config/db.js'

export function useMemory() {
  return !isDbReady() && process.env.NODE_ENV !== 'production'
}

export function requireDb() {
  if (!isDbReady()) {
    const err = new Error('Database unavailable. Start MongoDB and restart the API.')
    err.statusCode = 503
    throw err
  }
}

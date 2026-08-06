import { User } from '../models/User.model.js'
import { verifyToken } from '../utils/jwt.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { memoryAuth } from '../services/memoryAuth.js'
import { isDbReady } from '../config/db.js'

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  const token =
    header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token

  if (!token) {
    throw new AppError('Authentication required', 401)
  }

  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw new AppError('Invalid or expired token', 401)
  }

  if (!isDbReady() && process.env.NODE_ENV !== 'production') {
    const user = await memoryAuth.getRawById(decoded.sub)
    if (!user) throw new AppError('User no longer available', 401)
    req.user = user
    return next()
  }

  const user = await User.findById(decoded.sub)
  if (!user || !user.isActive) {
    throw new AppError('User no longer available', 401)
  }

  req.user = user
  next()
})

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    next(new AppError('Admin access required', 403))
    return
  }
  next()
}

/** Block admin API use until the seeded / forced password is changed. */
export const requirePasswordChanged = (req, _res, next) => {
  if (req.user?.mustChangePassword) {
    next(
      new AppError('You must change your password before continuing', 403, {
        code: 'MUST_CHANGE_PASSWORD',
      }),
    )
    return
  }
  next()
}

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  const token =
    header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token

  if (!token) return next()

  try {
    const decoded = verifyToken(token)
    if (!isDbReady() && process.env.NODE_ENV !== 'production') {
      const user = await memoryAuth.getRawById(decoded.sub)
      if (user) req.user = user
    } else {
      const user = await User.findById(decoded.sub)
      if (user?.isActive) req.user = user
    }
  } catch {
    // ignore
  }

  next()
})

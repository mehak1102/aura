import crypto from 'node:crypto'
import mongoose from 'mongoose'
import { User } from '../models/User.model.js'
import { signToken } from '../utils/jwt.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { memoryAuth } from '../services/memoryAuth.js'
import { isDbReady, ensureDbConnection } from '../config/db.js'
import { useMemory } from '../services/dbMode.js'

function authResponse(user, token) {
  const safe = typeof user.toSafeJSON === 'function' ? user.toSafeJSON() : user
  return {
    success: true,
    data: {
      user: safe,
      token,
    },
  }
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError('Name, email, and password are required')
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters')
  }

  await ensureDbConnection()

  if (useMemory()) {
    try {
      const user = await memoryAuth.register({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone?.trim(),
      })
      const token = signToken(user.id, user.role)
      console.warn('[dev] Auth using in-memory store (MongoDB offline)')
      res.status(201).json(authResponse(user, token))
      return
    } catch (err) {
      throw new AppError(err.message, err.statusCode || 400)
    }
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database unavailable. Start MongoDB and restart the API.', 503)
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() })
  if (exists) {
    throw new AppError('An account with this email already exists', 409)
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone?.trim(),
  })

  const token = signToken(user._id.toString(), user.role)
  res.status(201).json(authResponse(user, token))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email?.trim() || !password) {
    throw new AppError('Email and password are required')
  }

  await ensureDbConnection()

  if (useMemory()) {
    try {
      const user = await memoryAuth.login(email, password)
      const token = signToken(user.id, user.role)
      res.json(authResponse(user, token))
      return
    } catch (err) {
      throw new AppError(err.message, err.statusCode || 400)
    }
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database unavailable. Start MongoDB and restart the API.', 503)
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403)
  }

  const token = signToken(user._id.toString(), user.role)
  res.json(authResponse(user, token))
})

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user.toSafeJSON() },
  })
})

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Signed out successfully' })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body

  if (useMemory()) {
    const user = await memoryAuth.updateProfile(req.user.id, {
      name: name?.trim(),
      phone,
    })
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, data: { user } })
    return
  }

  const user = await User.findById(req.user._id)
  if (!user) throw new AppError('User not found', 404)

  if (name?.trim()) user.name = name.trim()
  if (phone !== undefined) user.phone = phone?.trim() || undefined
  await user.save()

  res.json({
    success: true,
    data: { user: user.toSafeJSON() },
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email?.trim()) throw new AppError('Email is required')

  const rawToken = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex')
  const expires = Date.now() + 60 * 60 * 1000

  if (useMemory()) {
    const user = await memoryAuth.setResetToken(
      email.toLowerCase().trim(),
      hashed,
      expires,
    )
    if (user && process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Password reset token for ${email}: ${rawToken}`)
    }
    res.json({
      success: true,
      message: 'If an account exists, reset instructions have been sent.',
      ...(user && process.env.NODE_ENV !== 'production' && { resetToken: rawToken }),
    })
    return
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database unavailable.', 503)
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (user) {
    user.resetPasswordToken = hashed
    user.resetPasswordExpires = new Date(expires)
    await user.save({ validateBeforeSave: false })
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Password reset token for ${user.email}: ${rawToken}`)
    }
  }

  res.json({
    success: true,
    message: 'If an account exists, reset instructions have been sent.',
    ...(user && process.env.NODE_ENV !== 'production' && { resetToken: rawToken }),
  })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    throw new AppError('Token and new password are required')
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters')
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex')

  if (useMemory()) {
    const user = await memoryAuth.resetPassword(hashed, password)
    if (!user) throw new AppError('Reset token is invalid or has expired', 400)
    const jwt = signToken(user.id, user.role)
    res.json(authResponse(user, jwt))
    return
  }

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password')

  if (!user) {
    throw new AppError('Reset token is invalid or has expired', 400)
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  const jwt = signToken(user._id.toString(), user.role)
  res.json(authResponse(user, jwt))
})

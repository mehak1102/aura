import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

/** In-memory user store — development only when MongoDB is offline */
const users = new Map()

function toSafe(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses ?? [],
    mustChangePassword: Boolean(user.mustChangePassword),
    createdAt: user.createdAt,
  }
}

export const memoryAuth = {
  async register({ name, email, password, phone }) {
    const key = email.toLowerCase()
    if (users.has(key)) {
      const err = new Error('An account with this email already exists')
      err.statusCode = 409
      throw err
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email: key,
      password: await bcrypt.hash(password, 12),
      phone,
      role: 'customer',
      avatar: undefined,
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }

    users.set(key, user)
    return toSafe(user)
  },

  async login(email, password) {
    const user = users.get(email.toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error('Invalid email or password')
      err.statusCode = 401
      throw err
    }
    if (!user.isActive) {
      const err = new Error('This account has been deactivated')
      err.statusCode = 403
      throw err
    }
    return toSafe(user)
  },

  async findById(id) {
    for (const user of users.values()) {
      if (user.id === id && user.isActive) return toSafe(user)
    }
    return null
  },

  async findByEmail(email) {
    const user = users.get(email.toLowerCase())
    return user ? toSafe(user) : null
  },

  async updateProfile(id, { name, phone }) {
    for (const [key, user] of users.entries()) {
      if (user.id === id) {
        if (name) user.name = name
        if (phone !== undefined) user.phone = phone
        users.set(key, user)
        return toSafe(user)
      }
    }
    return null
  },

  async setResetToken(email, hashedToken, expires) {
    const user = users.get(email.toLowerCase())
    if (!user) return null
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = expires
    return user
  },

  async resetPassword(hashedToken, password) {
    for (const [key, user] of users.entries()) {
      if (
        user.resetPasswordToken === hashedToken &&
        user.resetPasswordExpires &&
        user.resetPasswordExpires > Date.now()
      ) {
        user.password = await bcrypt.hash(password, 12)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        users.set(key, user)
        return toSafe(user)
      }
    }
    return null
  },

  /** Internal: attach full user for JWT protect */
  async getRawById(id) {
    for (const user of users.values()) {
      if (user.id === id && user.isActive) {
        return {
          ...toSafe(user),
          addresses: user.addresses ?? [],
          toSafeJSON() {
            return toSafe(user)
          },
        }
      }
    }
    return null
  },

  async upsertAddress(userId, input, addressId) {
    for (const [key, user] of users.entries()) {
      if (user.id !== userId) continue
      const addresses = user.addresses ?? []
      if (addressId) {
        const idx = addresses.findIndex((a) => a.id === addressId)
        if (idx < 0) return null
        addresses[idx] = { ...addresses[idx], ...input, id: addressId }
      } else {
        const id = crypto.randomUUID()
        addresses.push({ ...input, id })
        if (input.isDefault || addresses.length === 1) {
          addresses.forEach((a) => {
            a.isDefault = a.id === id
          })
        }
      }
      if (input.isDefault && addressId) {
        addresses.forEach((a) => {
          a.isDefault = a.id === addressId
        })
      }
      user.addresses = addresses
      users.set(key, user)
      const saved = addressId
        ? addresses.find((a) => a.id === addressId)
        : addresses[addresses.length - 1]
      return saved
    }
    return null
  },

  async deleteAddress(userId, addressId) {
    for (const [key, user] of users.entries()) {
      if (user.id !== userId) continue
      const before = user.addresses ?? []
      const addresses = before.filter((a) => a.id !== addressId)
      if (addresses.length === before.length) return false
      if (addresses.length && !addresses.some((a) => a.isDefault)) {
        addresses[0].isDefault = true
      }
      user.addresses = addresses
      users.set(key, user)
      return true
    }
    return false
  },

  listUsers() {
    return [...users.values()].map((u) => toSafe(u))
  },

  async ensureDevAdmin({ email, password, name }) {
    const key = email.toLowerCase()
    if (users.has(key)) {
      const user = users.get(key)
      user.role = 'admin'
      if (user.mustChangePassword == null) user.mustChangePassword = true
      users.set(key, user)
      return toSafe(user)
    }
    const user = {
      id: crypto.randomUUID(),
      name,
      email: key,
      password: await bcrypt.hash(password, 12),
      phone: undefined,
      role: 'admin',
      avatar: undefined,
      addresses: [],
      isActive: true,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }
    users.set(key, user)
    console.warn(`[dev] Admin account ready: ${email}`)
    return toSafe(user)
  },

  async setDefaultAddress(userId, addressId) {
    for (const [key, user] of users.entries()) {
      if (user.id !== userId) continue
      const addresses = user.addresses ?? []
      const target = addresses.find((a) => a.id === addressId)
      if (!target) return null
      addresses.forEach((a) => {
        a.isDefault = a.id === addressId
      })
      user.addresses = addresses
      users.set(key, user)
      return target
    }
    return null
  },
}

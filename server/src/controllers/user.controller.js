import { User } from '../models/User.model.js'
import { Product } from '../models/Product.model.js'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { useMemory } from '../services/dbMode.js'
import { memoryAuth } from '../services/memoryAuth.js'

function getUserId(req) {
  return req.user.id || req.user._id?.toString()
}

function formatAddress(addr) {
  return {
    id: addr._id?.toString?.() || addr.id,
    label: addr.label,
    fullName: addr.fullName,
    phone: addr.phone,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    isDefault: addr.isDefault,
  }
}

export const listAddresses = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const user = await memoryAuth.getRawById(userId)
    res.json({
      success: true,
      data: { addresses: (user?.addresses || []).map(formatAddress) },
    })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)
  res.json({
    success: true,
    data: { addresses: user.addresses.map(formatAddress) },
  })
})

export const upsertAddress = asyncHandler(async (req, res) => {
  const userId = getUserId(req)
  const input = req.body
  const addressId = req.params.id

  if (useMemory()) {
    const updated = await memoryAuth.upsertAddress(userId, input, addressId)
    if (!updated) throw new AppError('User not found', 404)
    res.json({ success: true, data: { address: formatAddress(updated) } })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)

  if (addressId) {
    const addr = user.addresses.id(addressId)
    if (!addr) throw new AppError('Address not found', 404)
    Object.assign(addr, input)
    if (input.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === addressId
      })
    }
  } else {
    user.addresses.push(input)
    if (input.isDefault || user.addresses.length === 1) {
      const newId = user.addresses[user.addresses.length - 1]._id.toString()
      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === newId
      })
    }
  }

  await user.save()
  const saved = addressId
    ? user.addresses.id(addressId)
    : user.addresses[user.addresses.length - 1]
  res.status(addressId ? 200 : 201).json({
    success: true,
    data: { address: formatAddress(saved) },
  })
})

export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const ok = await memoryAuth.deleteAddress(userId, req.params.id)
    if (!ok) throw new AppError('Address not found', 404)
    res.json({ success: true, message: 'Address removed' })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)
  const addr = user.addresses.id(req.params.id)
  if (!addr) throw new AppError('Address not found', 404)
  const wasDefault = addr.isDefault
  addr.deleteOne()
  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true
  }
  await user.save()
  res.json({ success: true, message: 'Address removed' })
})

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = getUserId(req)

  if (useMemory()) {
    const address = await memoryAuth.setDefaultAddress(userId, req.params.id)
    if (!address) throw new AppError('Address not found', 404)
    res.json({ success: true, data: { address: formatAddress(address) } })
    return
  }

  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)
  const addr = user.addresses.id(req.params.id)
  if (!addr) throw new AppError('Address not found', 404)
  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === req.params.id
  })
  await user.save()
  res.json({ success: true, data: { address: formatAddress(addr) } })
})

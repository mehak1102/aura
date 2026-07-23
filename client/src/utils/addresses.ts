import { z } from 'zod'
import type { Address } from '@/types'

export const addressFormSchema = z.object({
  label: z.string().min(1, 'Add a label').max(40),
  fullName: z.string().min(2, 'Enter full name'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone')
    .regex(/^[0-9+\-\s]+$/, 'Enter a valid phone'),
  line1: z.string().min(5, 'Enter address line 1'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(2, 'Enter state'),
  postalCode: z.string().min(5, 'Enter postal code').max(10),
  country: z.string().min(2, 'Enter country'),
  isDefault: z.boolean().optional(),
})

export type AddressFormInput = z.infer<typeof addressFormSchema>

const KEY = 'aura_addresses'

export function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Address[]) : []
  } catch {
    return []
  }
}

export function saveAddresses(addresses: Address[]) {
  localStorage.setItem(KEY, JSON.stringify(addresses))
}

export function upsertAddress(
  input: AddressFormInput,
  id?: string,
): Address[] {
  const list = loadAddresses()
  const next: Address = {
    id: id || crypto.randomUUID(),
    label: input.label,
    fullName: input.fullName,
    phone: input.phone,
    line1: input.line1,
    line2: input.line2,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country,
    isDefault: Boolean(input.isDefault),
  }

  let updated: Address[]
  if (id && list.some((a) => a.id === id)) {
    updated = list.map((a) => (a.id === id ? next : a))
  } else {
    updated = [...list, next]
  }

  if (next.isDefault) {
    updated = updated.map((a) => ({
      ...a,
      isDefault: a.id === next.id,
    }))
  } else if (updated.length === 1) {
    updated[0].isDefault = true
  }

  saveAddresses(updated)
  return updated
}

export function deleteAddress(id: string): Address[] {
  let updated = loadAddresses().filter((a) => a.id !== id)
  if (updated.length && !updated.some((a) => a.isDefault)) {
    updated = updated.map((a, i) => ({ ...a, isDefault: i === 0 }))
  }
  saveAddresses(updated)
  return updated
}

export function setDefaultAddress(id: string): Address[] {
  const updated = loadAddresses().map((a) => ({
    ...a,
    isDefault: a.id === id,
  }))
  saveAddresses(updated)
  return updated
}

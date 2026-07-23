import { z } from 'zod'

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone')
    .max(15, 'Enter a valid phone')
    .regex(/^[0-9+\-\s]+$/, 'Enter a valid phone'),
  line1: z.string().min(5, 'Enter address line 1'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(2, 'Enter state'),
  postalCode: z
    .string()
    .min(5, 'Enter postal code')
    .max(10, 'Enter postal code'),
  country: z.string().min(2, 'Enter country'),
  notes: z.string().optional(),
})

export const shippingMethodSchema = z.enum(['standard', 'express'])

export const checkoutSchema = shippingAddressSchema.extend({
  shippingMethod: shippingMethodSchema,
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ShippingMethod = z.infer<typeof shippingMethodSchema>

export const SHIPPING_OPTIONS: {
  id: ShippingMethod
  label: string
  detail: string
  price: number
}[] = [
  {
    id: 'standard',
    label: 'Standard',
    detail: '3–5 business days',
    price: 0,
  },
  {
    id: 'express',
    label: 'Express',
    detail: '1–2 business days',
    price: 149,
  },
]

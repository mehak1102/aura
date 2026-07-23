import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Seo } from '@components/seo/Seo'
import {
  Body,
  Display,
  Eyebrow,
  Input,
  MagneticButton,
  Badge,
} from '@components/ui'
import { AccountShell } from '@components/account/AccountShell'
import { useAuth } from '@contexts/AuthContext'
import { addressesApi } from '@services/api/addresses'
import type { Address } from '@/types'
import {
  addressFormSchema,
  deleteAddress,
  loadAddresses,
  setDefaultAddress,
  upsertAddress,
  type AddressFormInput,
} from '@utils/addresses'

const emptyDefaults: AddressFormInput = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
}

export default function AddressesPage() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const { data: remoteAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressesApi.list(),
    enabled: isAuthenticated,
  })
  const [addresses, setAddresses] = useState<Address[]>(() => loadAddresses())
  const displayAddresses = isAuthenticated
    ? (remoteAddresses ?? addresses)
    : addresses
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const editing = useMemo(
    () => addresses.find((a) => a.id === editingId),
    [addresses, editingId],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormInput>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: emptyDefaults,
  })

  const openCreate = () => {
    setEditingId(null)
    reset({ ...emptyDefaults, isDefault: addresses.length === 0 })
    setShowForm(true)
  }

  const openEdit = (address: Address) => {
    setEditingId(address.id)
    reset({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setShowForm(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    if (isAuthenticated) {
      try {
        if (editingId) await addressesApi.update(editingId, values)
        else await addressesApi.create(values)
        await queryClient.invalidateQueries({ queryKey: ['addresses'] })
      } catch {
        const next = upsertAddress(values, editingId ?? undefined)
        setAddresses(next)
      }
    } else {
      const next = upsertAddress(values, editingId ?? undefined)
      setAddresses(next)
    }
    setShowForm(false)
    setEditingId(null)
    reset(emptyDefaults)
  })

  return (
    <>
      <Seo title="Addresses" noindex />
      <AccountShell>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Addresses</Eyebrow>
            <Display as="h1" size="md" className="mt-3 text-forest">
              Shipping addresses
            </Display>
            <Body muted className="mt-2">
              {isAuthenticated
                ? 'Synced to your account for faster checkout.'
                : 'Saved locally for faster checkout.'}
            </Body>
          </div>
          <MagneticButton variant="outline" onClick={openCreate}>
            Add address
          </MagneticButton>
        </div>

        {showForm && (
          <form
            onSubmit={onSubmit}
            className="mt-10 border border-charcoal/10 p-6"
            noValidate
          >
            <Eyebrow tone="gold">
              {editing ? 'Edit address' : 'New address'}
            </Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input
                label="Label"
                error={errors.label?.message}
                {...register('label')}
              />
              <Input
                label="Full name"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label="Phone"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address line 1"
                  error={errors.line1?.message}
                  {...register('line1')}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Address line 2"
                  error={errors.line2?.message}
                  {...register('line2')}
                />
              </div>
              <Input
                label="City"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State"
                error={errors.state?.message}
                {...register('state')}
              />
              <Input
                label="Postal code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
              <Input
                label="Country"
                error={errors.country?.message}
                {...register('country')}
              />
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('isDefault')} />
              Set as default
            </label>
            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save address'}
              </MagneticButton>
              <MagneticButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </MagneticButton>
            </div>
          </form>
        )}

        {!displayAddresses.length && !showForm ? (
          <div className="mt-16 text-center">
            <Body muted>No addresses saved yet.</Body>
            <div className="mt-6">
              <MagneticButton onClick={openCreate}>Add your first</MagneticButton>
            </div>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {displayAddresses.map((address) => (
              <li
                key={address.id}
                className="border border-charcoal/10 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl">{address.label}</p>
                    {address.isDefault && (
                      <Badge tone="gold" className="mt-2">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <Body size="sm" muted className="mt-3">
                  {address.fullName}
                  <br />
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                  <br />
                  {address.country}
                  <br />
                  {address.phone}
                </Body>
                <div className="mt-5 flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="text-micro text-forest"
                    onClick={() => openEdit(address)}
                  >
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      type="button"
                      className="text-micro text-olive"
                      onClick={async () => {
                        if (isAuthenticated) {
                          try {
                            await addressesApi.setDefault(address.id)
                            await queryClient.invalidateQueries({
                              queryKey: ['addresses'],
                            })
                          } catch {
                            setAddresses(setDefaultAddress(address.id))
                          }
                        } else {
                          setAddresses(setDefaultAddress(address.id))
                        }
                      }}
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-micro text-olive hover:text-forest"
                    onClick={async () => {
                      if (isAuthenticated) {
                        try {
                          await addressesApi.remove(address.id)
                          await queryClient.invalidateQueries({
                            queryKey: ['addresses'],
                          })
                        } catch {
                          setAddresses(deleteAddress(address.id))
                        }
                      } else {
                        setAddresses(deleteAddress(address.id))
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountShell>
    </>
  )
}

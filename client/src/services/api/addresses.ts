import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { Address, ApiResponse } from '@/types'
import type { AddressFormInput } from '@utils/addresses'

export const addressesApi = {
  async list() {
    const { data } = await api.get<ApiResponse<{ addresses: Address[] }>>(
      API_ENDPOINTS.addresses.list,
    )
    return data.data.addresses
  },

  async create(input: AddressFormInput) {
    const { data } = await api.post<ApiResponse<{ address: Address }>>(
      API_ENDPOINTS.addresses.create,
      input,
    )
    return data.data.address
  },

  async update(id: string, input: AddressFormInput) {
    const { data } = await api.patch<ApiResponse<{ address: Address }>>(
      API_ENDPOINTS.addresses.update(id),
      input,
    )
    return data.data.address
  },

  async remove(id: string) {
    await api.delete(API_ENDPOINTS.addresses.remove(id))
  },

  async setDefault(id: string) {
    const { data } = await api.patch<ApiResponse<{ address: Address }>>(
      API_ENDPOINTS.addresses.setDefault(id),
    )
    return data.data.address
  },
}

import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { User, ApiResponse } from '@/types'
import type {
  ForgotPasswordInput,
  LoginInput,
  ProfileInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/lib/authSchemas'

type AuthPayload = {
  user: User
  token: string
}

const TOKEN_KEY = 'aura_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export const authApi = {
  async login(input: LoginInput) {
    const { data } = await api.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.auth.login,
      input,
    )
    return data.data
  },

  async register(input: Omit<RegisterInput, 'confirmPassword'>) {
    const { data } = await api.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.auth.register,
      input,
    )
    return data.data
  },

  async me() {
    const { data } = await api.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.auth.me,
    )
    return data.data.user
  },

  async logout() {
    await api.post(API_ENDPOINTS.auth.logout)
    setStoredToken(null)
  },

  async updateProfile(input: ProfileInput) {
    const { data } = await api.patch<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.auth.me,
      input,
    )
    return data.data.user
  },

  async changePassword(input: {
    currentPassword: string
    newPassword: string
  }) {
    const { data } = await api.post<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.auth.changePassword,
      input,
    )
    return data.data.user
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const { data } = await api.post<{
      success: boolean
      message?: string
      resetToken?: string
    }>(API_ENDPOINTS.auth.forgotPassword, input)
    return data
  },

  async resetPassword(input: ResetPasswordInput) {
    const { data } = await api.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.auth.resetPassword,
      {
        token: input.token,
        password: input.password,
      },
    )
    return data.data
  },
}

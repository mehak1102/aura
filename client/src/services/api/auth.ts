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

/** Legacy cleanup — JWTs must not live in localStorage. */
export function getStoredToken() {
  return null
}

export function setStoredToken(_token: string | null) {
  localStorage.removeItem(TOKEN_KEY)
}

export const authApi = {
  async login(input: LoginInput) {
    setStoredToken(null)
    const { data } = await api.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.auth.login,
      input,
    )
    return data.data
  },

  async register(input: Omit<RegisterInput, 'confirmPassword'>) {
    setStoredToken(null)
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
    try {
      await api.post(API_ENDPOINTS.auth.logout)
    } finally {
      setStoredToken(null)
    }
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
      resetUrl?: string
      devHint?: string
    }>(API_ENDPOINTS.auth.forgotPassword, input)
    return data
  },

  async resetPassword(input: ResetPasswordInput) {
    setStoredToken(null)
    const { data } = await api.post<{ success: boolean; message?: string }>(
      API_ENDPOINTS.auth.resetPassword,
      {
        token: input.token,
        password: input.password,
      },
    )
    return data
  },
}

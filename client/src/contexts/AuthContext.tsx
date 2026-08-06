import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types'
import { authApi, setStoredToken } from '@services/api/auth'
import type {
  LoginInput,
  ProfileInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/lib/authSchemas'

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<User>
  logout: () => Promise<void>
  updateProfile: (input: ProfileInput) => Promise<User>
  resetPassword: (input: ResetPasswordInput) => Promise<User>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setStoredToken(null)
    try {
      const me = await authApi.me()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = useCallback(async (input: LoginInput) => {
    const { user: nextUser } = await authApi.login(input)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const { confirmPassword: _, ...payload } = input
    const { user: nextUser } = await authApi.register(payload)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // clear locally even if API fails
    } finally {
      setStoredToken(null)
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (input: ProfileInput) => {
    const nextUser = await authApi.updateProfile(input)
    setUser(nextUser)
    return nextUser
  }, [])

  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    const { user: nextUser } = await authApi.resetPassword(input)
    setUser(nextUser)
    return nextUser
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: null,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      resetPassword,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      resetPassword,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

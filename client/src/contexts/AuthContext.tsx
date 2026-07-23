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
import {
  authApi,
  getStoredToken,
  setStoredToken,
} from '@services/api/auth'
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
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const stored = getStoredToken()
    if (!stored) {
      setUser(null)
      setToken(null)
      setIsLoading(false)
      return
    }

    try {
      const me = await authApi.me()
      setUser(me)
      setToken(stored)
    } catch {
      setStoredToken(null)
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = useCallback(async (input: LoginInput) => {
    const { user: nextUser, token: nextToken } = await authApi.login(input)
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const { confirmPassword: _, ...payload } = input
    const { user: nextUser, token: nextToken } = await authApi.register(payload)
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) await authApi.logout()
    } catch {
      // clear locally even if API fails
    } finally {
      setStoredToken(null)
      setToken(null)
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (input: ProfileInput) => {
    const nextUser = await authApi.updateProfile(input)
    setUser(nextUser)
    return nextUser
  }, [])

  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    const { user: nextUser, token: nextToken } = await authApi.resetPassword(input)
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
    return nextUser
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
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
      token,
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

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
import { authApi } from '@services/api/admin'
import { getStoredToken, setStoredToken } from '@services/api/tokens'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  mustChangePassword: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const me = await authApi.me()
      if (me.role !== 'admin') {
        setStoredToken(null)
        setUser(null)
      } else {
        setUser(me)
      }
    } catch {
      setStoredToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const { user: nextUser, token } = await authApi.login(email, password)
    if (nextUser.role !== 'admin') {
      throw new Error('Admin access required for this panel')
    }
    setStoredToken(token)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setUser(null)
  }, [])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const next = await authApi.changePassword(currentPassword, newPassword)
      setUser(next)
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      mustChangePassword: Boolean(user?.mustChangePassword),
      isLoading,
      login,
      logout,
      changePassword,
    }),
    [user, isLoading, login, logout, changePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

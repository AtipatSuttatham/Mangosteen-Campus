import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { api } from '../../lib/api'
import { tokenStorage } from '../../lib/tokenStorage'
import type { User } from './types'

interface LoginPayload {
  identifier: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  first_name: string
  last_name: string
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    async function restoreSession() {
      if (!tokenStorage.getAccess()) {
        setIsLoading(false)
        return
      }
      try {
        const response = await api.get<User>('/auth/me')
        setUser(response.data)
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }
    void restoreSession()

    window.addEventListener('auth:logout', clearSession)
    return () => window.removeEventListener('auth:logout', clearSession)
  }, [clearSession])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await api.post<{ access: string; refresh: string; user: User }>(
      '/auth/login',
      payload,
    )
    tokenStorage.set(response.data.access, response.data.refresh)
    setUser(response.data.user)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.post('/auth/register', payload)
  }, [])

  const logout = useCallback(async () => {
    const refresh = tokenStorage.getRefresh()
    try {
      if (refresh) await api.post('/auth/logout', { refresh })
    } finally {
      clearSession()
    }
  }, [clearSession])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth ต้องถูกเรียกภายใน AuthProvider')
  return context
}

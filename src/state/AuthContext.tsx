import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export type User = {
  email: string
  name: string
  _id: string
}

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'campuscart_user_v1'

function safeParseUser(raw: string | null): User | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as User
    if (!parsed?.email || !parsed?.name || !parsed?._id) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(() =>
    safeParseUser(localStorage.getItem(STORAGE_KEY)),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, user ? JSON.stringify(user) : '')
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email: string, _password: string) => {
        const cleanedEmail = email.trim().toLowerCase()
        const nameFromEmail = cleanedEmail.split('@')[0] || 'Student'
        const nextUser: User = {
          email: cleanedEmail,
          name: nameFromEmail,
          _id: Date.now().toString(),
        }
        setUser(nextUser)
        navigate('/dashboard', { replace: true })
      },
      signup: async (email: string, _password: string, name: string) => {
        const cleanedEmail = email.trim().toLowerCase()
        const nextUser: User = {
          email: cleanedEmail,
          name: name.trim() || 'Student',
          _id: Date.now().toString(),
        }
        setUser(nextUser)
        navigate('/dashboard', { replace: true })
      },
      logout: () => {
        setUser(null)
        navigate('/', { replace: true })
      },
    }),
    [navigate, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


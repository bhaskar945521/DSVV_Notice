import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

interface AuthContextType {
  user: any
  token: string | null
  loading: boolean
  login: (email: string, pass: string) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('dsvv_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await authService.getMe()
          if (res.success) {
            setUser(res.user)
          } else {
            handleLogout()
          }
        } catch (e) {
          handleLogout()
        }
      }
      setLoading(false)
    }
    fetchMe()
  }, [token])

  const handleLogin = async (email: string, pass: string) => {
    const res = await authService.login(email, pass)
    if (res.success) {
      localStorage.setItem('dsvv_token', res.token)
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const handleLogout = () => {
    localStorage.removeItem('dsvv_token')
    setToken(null)
    setUser(null)
    authService.logout()
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

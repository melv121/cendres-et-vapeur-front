import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types/Product.ts'
import * as api from '../api/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string, code?: string) => Promise<{ success: boolean; message: string; user_id?: number }>
  verify2fa: (userId: number, code: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'cev_auth_token'
const USER_STORAGE_KEY = 'cev_auth_user'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
    setLoading(false)
  }, [])

  // Listen for login/logout events
  useEffect(() => {
    const handleUserLoggedIn = () => {
      const storedToken = localStorage.getItem(STORAGE_KEY)
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      
      if (storedToken && storedUser) {
        setToken(storedToken)
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('Failed to parse stored user:', e)
        }
      }
    }

    window.addEventListener('userLoggedIn', handleUserLoggedIn)
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user_id?: number }> => {
    try {
      const response = await api.login(email, password)
      
      if (response.success) {
        return {
          success: true,
          message: response.message,
          user_id: response.user_id
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const verify2fa = async (userId: number, code: string): Promise<void> => {
    try {
      const response = await api.verify2FA(userId, code)
      
      if (response.success && response.token) {
        setToken(response.token)
        localStorage.setItem(STORAGE_KEY, response.token)
        
        // Extract user data from response
        const userData: User = {
          id: response.user?.id,
          username: response.user?.username,
          email: response.user?.email,
          role: response.user?.role || 'USER',
          avatar_url: response.user?.avatar_url,
          biography: response.user?.biography,
        }
        
        setUser(userData)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      } else {
        throw new Error('2FA verification failed')
      }
    } catch (error) {
      console.error('2FA verification failed:', error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      const response = await api.register(username, email, password)
      
      if (response.success) {
        // Registration successful, but user still needs to login
        // Role will be set to USER by default
        const userData: User = {
          id: response.user?.id,
          username: response.user?.username,
          email: response.user?.email,
          role: response.user?.role || 'USER',
          avatar_url: response.user?.avatar_url,
          biography: response.user?.biography,
        }
        
        setUser(userData)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    verify2fa,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }

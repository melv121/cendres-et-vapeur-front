import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types/Product.ts'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const MOCK_TOKEN = 'mock-jwt-token-cendres-et-vapeur'

const MOCK_USER: User = {
  id: 1,
  username: 'Voyageur',
  email: 'voyageur@cendres.fr',
  role: 'user',
  avatar_url: undefined,
  biography: 'Un voyageur des terres de cendres.'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'cev_auth_token'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    if (storedToken) {
      setToken(storedToken)
      setUser(MOCK_USER)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, _password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const loggedInUser: User = { ...MOCK_USER, email }
    setUser(loggedInUser)
    setToken(MOCK_TOKEN)
    localStorage.setItem(STORAGE_KEY, MOCK_TOKEN)
  }

  const register = async (username: string, email: string, _password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser: User = { ...MOCK_USER, username, email }
    setUser(newUser)
    setToken(MOCK_TOKEN)
    localStorage.setItem(STORAGE_KEY, MOCK_TOKEN)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
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

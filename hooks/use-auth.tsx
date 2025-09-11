"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "employee" | "supervisor"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "anna.meikalainen@yritys.fi",
    password: "password123",
    name: "Anna Meikäläinen",
    role: "employee",
  },
  {
    id: "2",
    email: "pekka.esimies@yritys.fi",
    password: "password123",
    name: "Pekka Esimies",
    role: "supervisor",
  },
  {
    id: "3",
    email: "maria.tyontekija@yritys.fi",
    password: "password123",
    name: "Maria Työntekijä",
    role: "employee",
  },
  {
    id: "4",
    email: "employee@company.com",
    password: "password123",
    name: "Test Employee",
    role: "employee",
  },
  {
    id: "5",
    email: "supervisor@company.com",
    password: "password123",
    name: "Test Supervisor",
    role: "supervisor",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    console.log("[v0] Login attempt:", { email, password })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    console.log("[v0] Found user:", foundUser)

    if (!foundUser) {
      setIsLoading(false)
      throw new Error("Virheelliset kirjautumistiedot")
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    console.log("[v0] Login successful, redirecting to:", foundUser.role === "supervisor" ? "/supervisor" : "/employee")

    // Redirect based on role
    if (foundUser.role === "supervisor") {
      router.push("/supervisor")
    } else {
      router.push("/employee")
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "../types"
import { currentUser } from "../constants/currentUser"

interface UserContextType {
  user: User
  canEdit: boolean
  canMoveIssues: boolean
  canUpdatePriority: boolean
  canMarkResolved: boolean
  switchRole: (role: "admin" | "contributor") => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const savedRole = localStorage.getItem("dev-user-role") as "admin" | "contributor" | null
    return {
      ...currentUser,
      role: savedRole || currentUser.role,
    }
  })

  const isAdmin = user.role === "admin"

  const switchRole = (role: "admin" | "contributor") => {
    const newUser = { ...user, role }
    setUser(newUser)
    localStorage.setItem("dev-user-role", role)
  }

  const contextValue: UserContextType = {
    user,
    canEdit: isAdmin,
    canMoveIssues: isAdmin,
    canUpdatePriority: isAdmin,
    canMarkResolved: isAdmin,
    switchRole,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

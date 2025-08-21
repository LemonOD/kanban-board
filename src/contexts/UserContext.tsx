import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import type { User } from "../types"
import { currentUser } from "../constants/currentUser"

interface UserContextType {
  user: User
  canEdit: boolean
  canMoveIssues: boolean
  canUpdatePriority: boolean
  canMarkResolved: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const isAdmin = currentUser.role === "admin"

  const contextValue: UserContextType = {
    user: currentUser,
    canEdit: isAdmin,
    canMoveIssues: isAdmin,
    canUpdatePriority: isAdmin,
    canMarkResolved: isAdmin,
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

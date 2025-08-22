import { useState } from "react"
import { useUser } from "../../contexts/UserContext"
import { useTheme } from "../../contexts/ThemeContext"
import { RoleTesting } from "./RoleTesting"
import { PollingSettings } from "./PollingSettings"
import RoleInformation from "./RoleInformation"

export const Settings = () => {
  const { user, switchRole } = useUser()
  const { theme } = useTheme()
  const [pollingInterval, setPollingInterval] = useState(10)

  const isDark = theme === "dark"

  const handlePollingIntervalChange = (interval: number) => {
    setPollingInterval(interval)
    // normally, this would update the polling interval
    console.log("Polling interval changed to:", interval, "seconds")
  }

  const handleRoleSwitch = (newRole: "admin" | "contributor") => {
    switchRole(newRole)
    console.log("Role switched to:", newRole)
  }

  return (
    <div className={`pt-20 max-w-4xl mx-auto space-y-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Current User:</span>
          <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{user.name}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.role === "admin"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Role Information */}
      <>
        <RoleInformation 
            user={user} 
            isDark={isDark} 
        />
      </>

      {/* Polling Settings */}
      <>
        <PollingSettings 
            pollingInterval={pollingInterval} 
            isDark={isDark} 
            handlePollingIntervalChange={handlePollingIntervalChange}
        />
      </>

      {/* Role Testing (Development Only) */}
      <>
        <RoleTesting 
            user={user} 
            isDark={isDark} 
            onRoleSwitch={handleRoleSwitch} 
        />
      </>
      
    </div>
  )
}
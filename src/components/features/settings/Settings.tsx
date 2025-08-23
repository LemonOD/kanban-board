import { useState, useEffect } from "react"
import { RoleTesting } from "./RoleTesting"
import { PollingSettings } from "./PollingSettings"
import RoleInformation from "./RoleInformation"
import { useUser } from "../../../contexts/UserContext"
import { usePollingContext } from "../../../contexts/PollingContext"


export const Settings = () => {
  const { user, switchRole } = useUser()
  const { pollingInterval, setPollingInterval } = usePollingContext()


  const handlePollingIntervalChange = (interval: number) => {
    
    setPollingInterval(parseInt(interval+'', 10))
    console.log(pollingInterval)
  }

  const handleRoleSwitch = (newRole: "admin" | "contributor") => {
    switchRole(newRole)
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto space-y-6 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Current User:</span>
          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
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
      <RoleInformation 
        user={user} 
      />

      {/* Polling Settings */}
      <PollingSettings 
        pollingInterval={pollingInterval / 1000} 
        handlePollingIntervalChange={handlePollingIntervalChange}
      />

      {/* Role Testing (Development Only) */}
      <RoleTesting 
        user={user} 
        onRoleSwitch={handleRoleSwitch} 
      />
      
    </div>
  )
}
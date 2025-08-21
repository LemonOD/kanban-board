import { Link, useLocation } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

export const Navigation = () => {
  const { user } = useUser()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link
              to="/board"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/board") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Board
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/settings")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Settings
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "admin" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

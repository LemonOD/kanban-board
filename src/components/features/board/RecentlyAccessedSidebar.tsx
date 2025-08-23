import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getRecentlyAccessedIssues } from "../../../utils/localStorage"
import { RecentlyAccessedIssue } from "../../../types"

export const RecentlyAccessedSidebar = () => {
  const [recentIssues, setRecentIssues] = useState<RecentlyAccessedIssue[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadRecentIssues = () => {
      const issues = getRecentlyAccessedIssues()
      setRecentIssues(issues)
    }

    // Load initially
    loadRecentIssues()

    // Listen for storage changes (when issues are accessed in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "recentlyAccessedIssues") {
        loadRecentIssues()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also refresh when the window gains focus (to catch updates from same tab)
    const handleFocus = () => {
      loadRecentIssues()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 right-4 ${!isOpen ? 'z-40' : ''} bg-white border border-gray-300 rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow`}
        aria-label="Toggle recently accessed issues"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {recentIssues.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {recentIssues.length}
            </span>
          )}
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 right-0 w-80 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recently Accessed</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {recentIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Issues</h3>
                <p className="text-gray-500">Click on issues to see them here</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {recentIssues.map((issue, index) => (
                  <Link
                    key={`${issue.id}-${issue.accessedAt}`}
                    to={`/issue/${issue.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-blue-600">#{issue.id}</span>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">{issue.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(issue.accessedAt)}</p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">Showing last {recentIssues.length} of 5 recent issues</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}

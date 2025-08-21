import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { Issue } from "../types"
import { mockFetchIssue, mockUpdateIssue, calculatePriorityScore } from "../utils/api"
import { useUser } from "../contexts/UserContext"
import { addRecentlyAccessedIssue } from "../utils/localStorage"

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  // const navigate = useNavigate()
  const { canMarkResolved } = useUser()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return

      try {
        setError(null)
        const fetchedIssue = await mockFetchIssue(id)
        setIssue(fetchedIssue)
        // Track this issue as recently accessed
        addRecentlyAccessedIssue({ id: fetchedIssue.id, title: fetchedIssue.title })
      } catch (err) {
        setError("Issue not found")
        console.error("Error loading issue:", err)
      } finally {
        setLoading(false)
      }
    }

    loadIssue()
  }, [id])

  const handleMarkAsResolved = async () => {
    if (!issue || !canMarkResolved || updating) return

    setUpdating(true)
    try {
      await mockUpdateIssue(issue.id, { status: "Done" })
      setIssue({ ...issue, status: "Done" })
      console.log("[v0] Issue marked as resolved successfully")
    } catch (err) {
      setError("Failed to mark issue as resolved")
      console.error("[v0] Error marking issue as resolved:", err)
    } finally {
      setUpdating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Backlog":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Done":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysSinceCreated = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading issue...</div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">{error || "Issue not found"}</div>
        <Link to="/board" className="text-blue-600 hover:text-blue-800 underline">
          Back to Board
        </Link>
      </div>
    )
  }

  const priorityScore = calculatePriorityScore(issue)
  const daysSinceCreated = getDaysSinceCreated(issue.createdAt)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/board" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Board
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Issue #{issue.id}</h1>
        </div>
        {canMarkResolved && issue.status !== "Done" && (
          <button
            onClick={handleMarkAsResolved}
            disabled={updating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? "Marking as Resolved..." : "Mark as Resolved"}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{issue.title}</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(issue.priority)}`}>
                {issue.priority} priority
              </span>
              <span className="text-sm text-gray-600">Severity: {issue.severity}</span>
              <span className="text-sm text-gray-600">Priority Score: {priorityScore}</span>
            </div>
          </div>

          {/* Description */}
          {issue.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{issue.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Assignee</h3>
                <p className="mt-1 text-lg text-gray-900">{issue.assignee}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created</h3>
                <p className="mt-1 text-lg text-gray-900">{formatDate(issue.createdAt)}</p>
                <p className="text-sm text-gray-500">{daysSinceCreated} days ago</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Priority Details</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-700">
                    Severity: {issue.severity} (×10 = {issue.severity * 10})
                  </p>
                  <p className="text-sm text-gray-700">
                    Days since created: {daysSinceCreated} (×-1 = {daysSinceCreated * -1})
                  </p>
                  <p className="text-sm text-gray-700">User defined rank: {issue.userDefinedRank || 0}</p>
                  <p className="text-sm font-medium text-gray-900">Total Score: {priorityScore}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {issue.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {issue.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Actions</h3>
        <div className="flex space-x-3">
          <Link
            to="/board"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Board
          </Link>
          {canMarkResolved && issue.status !== "Done" && (
            <button
              onClick={handleMarkAsResolved}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? "Marking as Resolved..." : "Mark as Resolved"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

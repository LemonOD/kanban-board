import { useEffect, useState, useCallback, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { useUser } from "../../../contexts/UserContext"
import { useToast } from "../../../contexts/ToastContext"
import { Issue, IssueStatus } from "../../../types"
import { mockUpdateIssue, calculatePriorityScore } from "../../../utils/api"
import { addRecentlyAccessedIssue, getIssueById, updateIssue } from "../../../utils/localStorage"
import { useRelativeTime } from "../../../hooks/useRelativeTime" // ✅ custom hook for "x sec/min/hr ago"


// Utils
const getPriorityColor = (priority: string) =>
  ({
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }[priority] ?? "bg-gray-100 text-gray-800 border-gray-200")

const getStatusColor = (status: string) =>
  ({
    Backlog: "bg-gray-100 text-gray-800 border-gray-200",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    Done: "bg-green-100 text-green-800 border-green-200",
  }[status] ?? "bg-gray-100 text-gray-800 border-gray-200")

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })


export const IssueDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { canMarkResolved } = useUser()
  const { showSuccess, showError, showToast } = useToast()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Fetch issue
  useEffect(() => {
    if (!id) return
    const loadIssue = async () => {
      try {
        const fetched =  await getIssueById(id)
        setIssue(fetched)
        if (fetched?.id && fetched?.title) {
          addRecentlyAccessedIssue({ id: fetched.id, title: fetched.title })
        }
      } catch {
        showError("Issue not found")
      } finally {
        setLoading(false)
      }
    }
    loadIssue()
  }, [id, showError])

  // Undo handler
  const handleUndoMarkAsResolved = useCallback(
    (issueId: string, prevStatus: IssueStatus) => {
      if (!issue) return
      setIssue({ ...issue, status: prevStatus })
      updateIssue(issueId, { status: prevStatus })
      showSuccess(`Issue moved back to ${prevStatus}`)

      mockUpdateIssue(issueId, { status: prevStatus }).catch(() => {
        showToast("Reverted locally - will sync when connection is restored", "warning")
      })
    },
    [issue, showSuccess, showToast]
  )

  // Mark as resolved
  const handleMarkAsResolved = useCallback(async () => {
    if (!issue || !canMarkResolved || updating) return
    setUpdating(true)

    const prevStatus = issue.status
    setIssue({ ...issue, status: "Done" })
    updateIssue(issue.id, { status: "Done" })

    try {
      await mockUpdateIssue(issue.id, { status: "Done" })
      showToast(
        "Issue marked as resolved",
        "success",
        () => handleUndoMarkAsResolved(issue.id, prevStatus),
        5000
      )
    } catch {
      setIssue({ ...issue, status: prevStatus })
      updateIssue(issue.id, { status: prevStatus })
      showToast(
        "Failed to mark as resolved - changes saved locally",
        "error",
        () => handleUndoMarkAsResolved(issue.id, prevStatus),
        8000
      )
    } finally {
      setUpdating(false)
    }
  }, [issue, canMarkResolved, updating, handleUndoMarkAsResolved, showToast])

  // Derived values
  const priorityScore = useMemo(() => (issue ? calculatePriorityScore(issue) : 0), [issue])
  const createdAgo = useRelativeTime(issue ? new Date(issue.createdAt) : null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Loading issue...</p>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-lg text-red-600">Issue not found</p>
        <Link to="/board" className="text-blue-600 hover:text-blue-800">
          Back to Board
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="min-w-0"> 
          {/* min-w-0 allows truncate/line-clamp to work inside flex */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {issue.title}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Created {formatDate(issue.createdAt)}</span>
            <span>•</span>
            <span>{createdAgo}</span>
          </div>
        </div>

        <Link
          to="/board"
          className="self-start px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
        >
          Back to Board
        </Link>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {issue.description && (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{issue.description}</p>
            </section>
          )}

          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Details</h2>
            <div className="space-y-4">
              <DetailRow label="Assignee" value={issue.assignee} />
              <DetailRow label="Priority Score" value={priorityScore} />
              {issue.tags.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
            <div className="space-y-4">
              <StatusBlock label="Current Status" value={issue.status} color={getStatusColor(issue.status)} />
              <StatusBlock
                label="Priority"
                value={issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                color={getPriorityColor(issue.priority)}
              />
              <StatusBlock label="Severity" value={`Level ${issue.severity}`} color="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" />

              {canMarkResolved && issue.status !== "Done" && (
                <button
                  onClick={handleMarkAsResolved}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updating ? "Marking as Resolved..." : "Mark as Resolved"}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
)

const StatusBlock = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div>
    <span className="text-gray-600 dark:text-gray-400 text-sm">{label}</span>
    <div className={`mt-1 px-3 py-2 rounded-lg border ${color}`}>{value}</div>
  </div>
)

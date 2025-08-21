import { Link } from "react-router-dom"
import type { Issue, IssueStatus } from "../types"
import { calculatePriorityScore } from "../utils/api"
import { addRecentlyAccessedIssue } from "../utils/localStorage"

interface IssueCardProps {
  issue: Issue
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void
  canMoveIssues: boolean
}

export const IssueCard = ({ issue, onStatusChange, canMoveIssues }: IssueCardProps) => {
  const priorityScore = calculatePriorityScore(issue)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextStatus = (currentStatus: IssueStatus): IssueStatus | null => {
    switch (currentStatus) {
      case "Backlog":
        return "In Progress"
      case "In Progress":
        return "Done"
      case "Done":
        return null
      default:
        return null
    }
  }

  const getPreviousStatus = (currentStatus: IssueStatus): IssueStatus | null => {
    switch (currentStatus) {
      case "In Progress":
        return "Backlog"
      case "Done":
        return "In Progress"
      case "Backlog":
        return null
      default:
        return null
    }
  }

  const handleCardClick = () => {
    addRecentlyAccessedIssue({ id: issue.id, title: issue.title })
  }

  const nextStatus = getNextStatus(issue.status)
  const previousStatus = getPreviousStatus(issue.status)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <Link
            to={`/issue/${issue.id}`}
            onClick={handleCardClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            #{issue.id}
          </Link>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
              {issue.priority}
            </span>
            <span className="text-xs text-gray-500">Score: {priorityScore}</span>
          </div>
        </div>

        <Link to={`/issue/${issue.id}`} onClick={handleCardClick} className="block text-gray-900 hover:text-gray-700">
          <h3 className="font-medium text-sm leading-tight">{issue.title}</h3>
        </Link>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Assigned to: {issue.assignee}</span>
          <span>Severity: {issue.severity}</span>
        </div>

        {issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {canMoveIssues && (
          <div className="flex justify-between pt-2 border-t border-gray-100">
            {previousStatus && (
              <button
                onClick={() => onStatusChange(issue.id, previousStatus)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                ← {previousStatus}
              </button>
            )}
            {nextStatus && (
              <button
                onClick={() => onStatusChange(issue.id, nextStatus)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors ml-auto"
              >
                {nextStatus} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

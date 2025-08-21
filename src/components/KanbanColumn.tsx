import type { Issue, IssueStatus } from "../types"
import { IssueCard } from "./IssueCard"

interface KanbanColumnProps {
  title: IssueStatus
  issues: Issue[]
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void
  canMoveIssues: boolean
}

export const KanbanColumn = ({ title, issues, onStatusChange, canMoveIssues }: KanbanColumnProps) => {
  const getColumnColor = (status: IssueStatus) => {
    switch (status) {
      case "Backlog":
        return "border-gray-300 bg-gray-50"
      case "In Progress":
        return "border-blue-300 bg-blue-50"
      case "Done":
        return "border-green-300 bg-green-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getHeaderColor = (status: IssueStatus) => {
    switch (status) {
      case "Backlog":
        return "text-gray-700 bg-gray-100"
      case "In Progress":
        return "text-blue-700 bg-blue-100"
      case "Done":
        return "text-green-700 bg-green-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  return (
    <div className={`rounded-lg border-2 ${getColumnColor(title)} min-h-96`}>
      <div className={`px-4 py-3 rounded-t-lg ${getHeaderColor(title)}`}>
        <h2 className="font-semibold text-lg">
          {title} ({issues.length})
        </h2>
      </div>
      <div className="p-4 space-y-3">
        {issues.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No issues</div>
        ) : (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onStatusChange={onStatusChange} canMoveIssues={canMoveIssues} />
          ))
        )}
      </div>
    </div>
  )
}

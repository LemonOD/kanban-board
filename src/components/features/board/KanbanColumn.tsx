import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import type { Issue, IssueStatus } from "../../../types"
import { CreateIssueModal } from "./CreateIssueModal"
import { IssueCard } from "./IssueCard"

interface KanbanColumnProps {
  title: IssueStatus
  issues: Issue[]
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void
  onCreateIssue: (issue: Omit<Issue, "id" | "createdAt">) => void
  canMoveIssues: boolean
}

export const KanbanColumn = ({ title, issues, onStatusChange, onCreateIssue, canMoveIssues }: KanbanColumnProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { isOver, setNodeRef } = useDroppable({
    id: title,
  })

  const columnColors: Record<IssueStatus, string> = {
  Backlog: "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800",
  "In Progress": "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20",
  Done: "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20",
};

const headerColors: Record<IssueStatus, string> = {
  Backlog: "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700",
  "In Progress": "text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800",
  Done: "text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-800",
};

  const columnClasses = `rounded-lg border-2 ${columnColors[title]} flex flex-col h-full max-h-[calc(100vh-250px)] transition-colors ${
    isOver ? "border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/30" : ""
  }`

  return (
      <div className={columnClasses} ref={setNodeRef}>
        <div className={`px-4 py-3 rounded-t-lg ${headerColors[title]} flex justify-between items-center`}>
          <h2 className="font-semibold text-lg">
            {title} ({issues.length})
          </h2>
          {
            canMoveIssues && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-6 h-6 rounded-full bg-white dark:bg-gray-600 bg-opacity-50 dark:bg-opacity-50 
                hover:bg-opacity-75 dark:hover:bg-opacity-75 flex items-center justify-center text-sm font-bold 
                transition-colors text-gray-700 dark:text-gray-200"
                title={`Add new issue to ${title}`}
                aria-label={`Add new issue to ${title}`}
              >
                +
              </button>
            )
          }
        </div>
        <div className="flex-1 overflow-hidden">
          {issues.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 py-8">
                {isOver ? "Drop issue here" : "No issues"}
              </div>
          ) : (
              <div className="p-4 space-y-3 overflow-y-auto h-full custom-scrollbar">
                {issues.map((issue) => (
                    <IssueCard
                        key={issue.id}
                        issue={issue}
                        onStatusChange={onStatusChange}
                        canMoveIssues={canMoveIssues}
                    />
                ))}
              </div>
          )}
        </div>

        <CreateIssueModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateIssue={onCreateIssue}
            defaultStatus={title}
        />
      </div>
  )
}

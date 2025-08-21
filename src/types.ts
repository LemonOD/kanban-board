export type IssueStatus = "Backlog" | "In Progress" | "Done"
export type IssuePriority = "low" | "medium" | "high"

export interface Issue {
  id: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  severity: number // 1-3 scale
  createdAt: string // ISO date string
  assignee: string
  tags: string[]
  userDefinedRank?: number // For custom priority ranking
  description?: string // For issue detail page
}

export type UserRole = "admin" | "contributor"

export interface User {
  name: string
  role: UserRole
}

export interface IssueFilters {
  search: string
  assignee: string
  severity: number | null
  tags: string[]
}

export interface IssueSortConfig {
  field: "priority" | "createdAt" | "title"
  direction: "asc" | "desc"
}

export interface UndoAction {
  id: string
  type: "status_change" | "update"
  previousState: Partial<Issue>
  timestamp: number
}

export interface RecentlyAccessedIssue {
  id: string
  title: string
  accessedAt: number
}

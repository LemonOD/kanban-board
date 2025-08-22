import {useCallback, useEffect, useMemo, useState} from "react"
import {RecentlyAccessedSidebar} from "./RecentlyAccessedSidebar"
import {ReadOnlyBanner} from "./ReadOnlyBanner"
import {DndContext, type DragEndEvent,PointerSensor,useSensor,useSensors} from "@dnd-kit/core"
import { Issue, IssueFilters, IssueSortConfig, IssueStatus, UndoAction } from "../../types"
import { useUser } from "../../contexts/UserContext"
import { calculatePriorityScore, mockFetchIssues, mockUpdateIssue } from "../../utils/api"
import { SearchAndFilters } from "./SearchAndFilters"
import { KanbanColumn } from "./KanbanColumn"
import SkeletonLoader from "../loader/SkeletonLoader"
import { Link } from "react-router-dom"
import { UndoToast } from "../reusables/UndoToast"

export const BoardContainer = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const { canMoveIssues } = useUser()

  const [filters, setFilters] = useState<IssueFilters>({
    search: "",
    assignee: "",
    severity: null,
    tags: [],
  })
    const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    })
  );

  const [sortConfig, setSortConfig] = useState<IssueSortConfig>({
    field: "priority",
    direction: "desc",
  })

  const columns: IssueStatus[] = ["Backlog", "In Progress", "Done"]

  const loadIssues = useCallback(async () => {
    try {
      setError(null)
      const fetchedIssues = await mockFetchIssues()
      setIssues(fetchedIssues)
      setLastSyncTime(new Date())
    } catch (err) {
      setError("Failed to load issues")
      console.error("Error loading issues:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIssues()
  }, [loadIssues])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadIssues()
  //   }, 10000)

  //   return () => clearInterval(interval)
  // }, [loadIssues])

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = issues

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
          (issue) =>
              issue.title.toLowerCase().includes(searchLower) ||
              issue.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply assignee filter
    if (filters.assignee) {
      filtered = filtered.filter((issue) => issue.assignee === filters.assignee)
    }

    // Apply severity filter
    if (filters.severity !== null) {
      filtered = filtered.filter((issue) => issue.severity === filters.severity)
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter((issue) => filters.tags.some((tag) => issue.tags.includes(tag)))
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case "priority": {
          const scoreA = calculatePriorityScore(a)
          const scoreB = calculatePriorityScore(b)
          comparison = scoreB - scoreA // Higher scores first
          // If scores match, newer issues appear higher
          if (comparison === 0) {
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          break
        }
        case "createdAt":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }

      return sortConfig.direction === "desc" ? comparison : -comparison
    })
  }, [issues, filters, sortConfig])

  const uniqueAssignees = useMemo(() => {
    return Array.from(new Set(issues.map((issue) => issue.assignee))).sort()
  }, [issues])

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    if (!canMoveIssues) return

    const issue = issues.find((i) => i.id === issueId)
    if (!issue) return

    const previousStatus = issue.status

    // Optimistic update
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i)))

    // Set up undo action
    const undoData: UndoAction = {
      id: issueId,
      type: "status_change",
      previousState: { status: previousStatus },
      timestamp: Date.now(),
    }
    setUndoAction(undoData)

    // Clear undo after 5 seconds
    setTimeout(() => {
      setUndoAction(null)
    }, 5000)

    try {
      await mockUpdateIssue(issueId, { status: newStatus })
      console.log("Issue status updated successfully")
    } catch (err) {
      // Revert optimistic update on error
      setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: previousStatus } : i)))
      setError("Failed to update issue status")
      setUndoAction(null)
      console.error("Error updating issue status:", err)
    }
  }

  const handleCreateIssue = async (newIssueData: Omit<Issue, "id" | "createdAt">) => {
    const newIssue: Issue = {
      ...newIssueData,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    // Optimistic update
    setIssues((prev) => [...prev, newIssue])

    try {
      // In a real app, this would be an API call to create the issue
      console.log("Created new issue:", newIssue)
    } catch (err) {
      // Revert optimistic update on error
      setIssues((prev) => prev.filter((i) => i.id !== newIssue.id))
      setError("Failed to create issue")
      console.error("Error creating issue:", err)
    }
  }


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !canMoveIssues) return

    const issueId = active.id as string
    const newStatus = over.id as IssueStatus

    const issue = issues.find((i) => i.id === issueId)
    if (!issue || issue.status === newStatus) return

    handleStatusChange(issueId, newStatus)
  }

  const handleUndo = () => {
    if (!undoAction) return

    const { id, previousState } = undoAction
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...previousState } : i)))
    setUndoAction(null)
  }

  const getIssuesForColumn = (status: IssueStatus) => {
    return filteredAndSortedIssues.filter((issue) => issue.status === status)
  }

  if (loading) {
    return (
      <SkeletonLoader />
    )
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">{error}</div>
        <Link to="/board" className="text-blue-600 hover:text-blue-800 ">
          Back to Board
        </Link>
      </div>
    )
  }

  return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Issue Board</h1>
            {lastSyncTime && (
                <div className="text-sm text-gray-500 ">Last synced: {lastSyncTime.toLocaleTimeString()}</div>
            )}
          </div>

          <ReadOnlyBanner />
          <div className="relative z-30">
              <SearchAndFilters
                filters={filters}
                sortConfig={sortConfig}
                onFiltersChange={setFilters}
                onSortChange={setSortConfig}
                assignees={uniqueAssignees}
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            {columns.map((status) => (
                <KanbanColumn
                    key={status}
                    title={status}
                    issues={getIssuesForColumn(status)}
                    onStatusChange={handleStatusChange}
                    onCreateIssue={handleCreateIssue}
                    canMoveIssues={canMoveIssues}
                />
            ))}
          </div>

          {undoAction && (
              <UndoToast message="Issue status changed" onUndo={handleUndo} onDismiss={() => setUndoAction(null)} />
          )}

          <RecentlyAccessedSidebar />
        </div>
      </DndContext>
  )
}

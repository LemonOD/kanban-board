import {useCallback, useEffect, useMemo, useState, useRef} from "react"
import {RecentlyAccessedSidebar} from "./RecentlyAccessedSidebar"
import {ReadOnlyBanner} from "./ReadOnlyBanner"
import {DndContext, type DragEndEvent,PointerSensor,useSensor,useSensors} from "@dnd-kit/core"
import { Issue, IssueFilters, IssueSortConfig, IssueStatus } from "../../../types"
import { useUser } from "../../../contexts/UserContext"
import { useToast } from "../../../contexts/ToastContext"
import { calculatePriorityScore, mockFetchIssues, mockUpdateIssue } from "../../../utils/api"
import { 
  saveIssues, 
  loadIssues, 
  updateIssueStatus, 
  addIssue, 
  mergeIssuesWithLocalChanges,
  savePendingUpdate,
  clearPendingUpdate
} from "../../../utils/localStorage"
import { SearchAndFilters } from "./SearchAndFilters"
import { KanbanColumn } from "./KanbanColumn"
import SkeletonLoader from "../../loader/SkeletonLoader"
import { useRelativeTime } from "../../../hooks/useRelativeTime"
import { usePolling } from "../../../hooks/usePolling"
import { usePollingContext } from "../../../contexts/PollingContext"

const DEFAULT_POLL_INTERVAL = 10; // seconds

function getPollInterval() {
  const value = localStorage.getItem("pollInterval");
  const parsed = value ? parseInt(value, 10) : NaN;
  return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_INTERVAL;
}

export const BoardContainer = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  
  const { canMoveIssues } = useUser()
  const { showSuccess, showError, showToast } = useToast()
  const toastRefs = useRef({ showSuccess, showError, showToast })
  const relativeSyncTime = useRelativeTime(lastSyncTime);
  
  useEffect(() => {
    toastRefs.current = { showSuccess, showError, showToast }
  }, [showSuccess, showError, showToast])

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

  const loadIssuesFromServer = useCallback(async () => {
    try {
      // initial load from localStorage
      const localIssues = loadIssues() || []
      
      if (localIssues.length > 0) {
        setIssues(localIssues)
       
        setTimeout(() => {
          toastRefs.current.showToast("Successfully fetched latest task", "info", undefined, 2000)
        }, 100)
      }

      // Then fetch from server and merge
      const fetchedIssues = await mockFetchIssues()
      const mergedIssues = mergeIssuesWithLocalChanges(fetchedIssues)
      
      setIssues(mergedIssues)
      saveIssues(mergedIssues)
      setLastSyncTime(new Date())
      
      if (localIssues.length === 0) {
        setTimeout(() => {
          toastRefs.current.showSuccess("Issues loaded successfully")
        }, 100)
      }
    } catch (err) {
      setTimeout(() => {
          toastRefs.current.showError("Error loading issues")
        }, 100)
      
      // Fallback to localStorage if available
      const localIssues = loadIssues() || []
      if (localIssues.length > 0) {
        setIssues(localIssues)
        setTimeout(() => {
          toastRefs.current.showToast("Using cached data - some features may be limited", "warning", undefined, 4000)
        }, 100)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // initial load on mount
  useEffect(() => {
    loadIssuesFromServer();
  }, [loadIssuesFromServer]);

  // polling logic replaces the old useEffect
  const { pollingInterval } = usePollingContext()

  usePolling(loadIssuesFromServer, pollingInterval)

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = issues.filter((issue) => {
      const matchesSearch = issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description?.toLowerCase().includes(filters.search.toLowerCase())
      const matchesAssignee = !filters.assignee || issue.assignee === filters.assignee
      const matchesSeverity = !filters.severity || issue.severity === filters.severity
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some((tag) => issue.tags.includes(tag))

      return matchesSearch && matchesAssignee && matchesSeverity && matchesTags
    })

    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case "priority":
          comparison = calculatePriorityScore(b) - calculatePriorityScore(a)
          break
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

    //no-op if status is the same
    if (issue.status === newStatus) return

    const previousStatus = issue.status

    // Optimistic update
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i)))
    
    // Save to localStorage immediately
    updateIssueStatus(issueId, newStatus)

    try {
      await mockUpdateIssue(issueId, { status: newStatus })
      clearPendingUpdate(issueId)
      
      // Show success toast with undo option only on success
      toastRefs.current.showToast(
        `Issue moved to ${newStatus}`,
        "success",
        () => handleUndoStatusChange(issueId, previousStatus),
        5000 // 5 seconds to undo
      )
    } catch (err) {
      // Don't revert optimistic update - keep the change in localStorage
      // Just save as pending update for later sync
      savePendingUpdate(issueId, { status: newStatus })
      
      // Show error toast with undo option
      toastRefs.current.showToast(
        "Failed to sync with server - changes saved locally", 
        "error", 
        () => handleUndoStatusChange(issueId, previousStatus),
        8000 // Longer duration for error
      )
      console.error("Error updating issue status:", err)
    }
  }

  const handleUndoStatusChange = (issueId: string, previousStatus: IssueStatus) => {
    const issue = issues.find((i) => i.id === issueId)
    if (!issue) return

    // Revert the change
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: previousStatus } : i)))
    updateIssueStatus(issueId, previousStatus)

    // Show immediate feedback
    toastRefs.current.showSuccess(`Issue moved back to ${previousStatus}`)

    // Try to sync with server
    mockUpdateIssue(issueId, { status: previousStatus })
      .then(() => {
        clearPendingUpdate(issueId)
        // Success is already shown above
      })
      .catch(() => {
        savePendingUpdate(issueId, { status: previousStatus })
        toastRefs.current.showToast("Reverted locally - will sync when connection is restored", "warning")
      })
  }

  const handleCreateIssue = async (newIssueData: Omit<Issue, "id" | "createdAt">) => {

    const newId = issues.length > 0 
    ? (Math.max(...issues.map(i => +i.id)) + 1).toString() 
    : "1"

    const newIssue: Issue = {
      ...newIssueData,
      id: newId,
      createdAt: new Date().toISOString(),
    }
    // Optimistic update
    setIssues((prev) => [...prev, newIssue])
    addIssue(newIssue)

    toastRefs.current.showSuccess("Issue created successfully")

    try {
      // In a real app, this would be an API call to create the issue
    } catch (err) {
      // Don't revert - keep the issue in localStorage
      savePendingUpdate(newIssue.id, newIssue)
      toastRefs.current.showToast("Issue created locally - will sync when connection is restored", "warning")
      console.error("Error creating issue:", err)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const issueId = active.id as string
    const newStatus = over.id as IssueStatus

    if (columns.includes(newStatus)) {
      handleStatusChange(issueId, newStatus)
    }
  }

  if (loading) {
    return <SkeletonLoader />
  }


  return (
    <div className="pt-20 flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <div className="flex items-center space-x-4">
            {lastSyncTime && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last synced: {relativeSyncTime}
              </span>
            )}
          </div>
        </div>

        {!canMoveIssues && <ReadOnlyBanner />}

        <SearchAndFilters
          filters={filters}
          onFiltersChange={setFilters}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          assignees={uniqueAssignees}
        />

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {columns.map((status) => (
              <KanbanColumn
                key={status}
                title={status}
                issues={filteredAndSortedIssues.filter((issue) => issue.status === status)}
                onStatusChange={handleStatusChange}
                onCreateIssue={handleCreateIssue}
                canMoveIssues={canMoveIssues}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <RecentlyAccessedSidebar />
    </div>
  )
}

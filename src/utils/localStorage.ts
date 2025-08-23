import type { RecentlyAccessedIssue, Issue, IssueStatus } from "../types"

const RECENTLY_ACCESSED_KEY = "recentlyAccessedIssues"
const ISSUES_KEY = "kanbanIssues"
const ISSUE_UPDATES_KEY = "issueUpdates"
const MAX_RECENT_ISSUES = 5

export const getRecentlyAccessedIssues = (): RecentlyAccessedIssue[] => {
  try {
    const stored = localStorage.getItem(RECENTLY_ACCESSED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const addRecentlyAccessedIssue = (issue: { id: string; title: string }): void => {
  try {
    const recent = getRecentlyAccessedIssues()
    const filtered = recent.filter((item) => item.id !== issue.id)
    const updated = [{ ...issue, accessedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT_ISSUES)

    localStorage.setItem(RECENTLY_ACCESSED_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const saveIssues = (issues: Issue[]): void => {
  try {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const loadIssues = (): Issue[] => {
  try {
    const stored = localStorage.getItem(ISSUES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}


export const updateIssueStatus = (issueId: string, newStatus: IssueStatus): void => {
  try {
    const issues = loadIssues()
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    )
    saveIssues(updatedIssues)
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const addIssue = (issue: Issue): void => {
  try {
    const issues = loadIssues()
    const updatedIssues = [...issues, issue]
    saveIssues(updatedIssues)
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const updateIssue = (issueId: string, updates: Partial<Issue>): void => {
  try {
    const issues = loadIssues()
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, ...updates } : issue
    )
    saveIssues(updatedIssues)
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Pending updates tracking (for offline/network issues)
export const savePendingUpdate = (issueId: string, updates: Partial<Issue>): void => {
  try {
    const pending = getPendingUpdates()
    pending[issueId] = { ...pending[issueId], ...updates, timestamp: Date.now() }
    localStorage.setItem(ISSUE_UPDATES_KEY, JSON.stringify(pending))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const getPendingUpdates = (): Record<string, Partial<Issue> & { timestamp: number }> => {
  try {
    const stored = localStorage.getItem(ISSUE_UPDATES_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export const clearPendingUpdate = (issueId: string): void => {
  try {
    const pending = getPendingUpdates()
    delete pending[issueId]
    localStorage.setItem(ISSUE_UPDATES_KEY, JSON.stringify(pending))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const clearAllPendingUpdates = (): void => {
  try {
    localStorage.removeItem(ISSUE_UPDATES_KEY)
  } catch {
    // Silently fail if localStorage is not available
  }
}

export const getIssueById = async (id: string): Promise<Issue | null> => {
  try {
    // artificial 600ms delay
    await new Promise(resolve => setTimeout(resolve, 600))

    const issues = loadIssues()
    return issues.find((i) => i.id === id) || null
  } catch {
    return null
  }
}

// Merge server data with local changes
export const mergeIssuesWithLocalChanges = (serverIssues: Issue[]): Issue[] => {
  try {
    const localIssues = loadIssues()
    const pendingUpdates = getPendingUpdates()
    
    // If we have local issues, use them as base
    if (localIssues.length > 0) {
      return localIssues.map(issue => {
        const pending = pendingUpdates[issue.id]
        return pending ? { ...issue, ...pending } : issue
      })
    }
    
    // Otherwise, use server issues and apply any pending updates
    return serverIssues.map(issue => {
      const pending = pendingUpdates[issue.id]
      return pending ? { ...issue, ...pending } : issue
    })
  } catch {
    return serverIssues
  }
}

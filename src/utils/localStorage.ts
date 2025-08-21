import type { RecentlyAccessedIssue } from "../types"

const RECENTLY_ACCESSED_KEY = "recentlyAccessedIssues"
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

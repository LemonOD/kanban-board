import type { Issue } from "../types"

export const mockFetchIssues = (): Promise<Issue[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      import("../data/issues.json").then((module) => resolve(module.default as Issue[]))
    }, 500)
  })
}

export const mockUpdateIssue = (issueId: string, updates: Partial<Issue>): Promise<Issue> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve({ id: issueId, ...updates } as Issue)
      } else {
        reject(new Error("Failed to update issue"))
      }
    }, 500)
  })
}

export const mockFetchIssue = (issueId: string): Promise<Issue> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      import("../data/issues.json").then((module) => {
        const issues = module.default as Issue[]
        const issue = issues.find((i) => i.id === issueId)
        if (issue) {
          resolve(issue)
        } else {
          reject(new Error("Issue not found"))
        }
      })
    }, 500)
  })
}

export const calculatePriorityScore = (issue: Issue): number => {
  const daysSinceCreated = Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const userDefinedRank = issue.userDefinedRank || 0

  // Priority score formula: severity * 10 + (daysSinceCreated * -1) + userDefinedRank
  return issue.severity * 10 + daysSinceCreated * -1 + userDefinedRank
}

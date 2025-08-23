import { mockFetchIssues, mockUpdateIssue, mockFetchIssue } from "../api"
import type { Issue } from "../../types"

// Mock the issues.json import
jest.mock("../../data/issues.json", () => [
  {
    id: "1",
    title: "Test Issue 1",
    status: "Backlog" as const,
    priority: "medium" as const,
    severity: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    assignee: "Alice",
    tags: ["bug"],
    userDefinedRank: 0,
  },
  {
    id: "2",
    title: "Test Issue 2",
    status: "In Progress" as const,
    priority: "high" as const,
    severity: 3,
    createdAt: "2024-01-02T00:00:00.000Z",
    assignee: "Bob",
    tags: ["feature"],
    userDefinedRank: 5,
  },
])

describe("Mock API Functions", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("mockFetchIssues", () => {
    test("fetches all issues successfully", async () => {
      const promise = mockFetchIssues()
      
      // Fast-forward time to resolve the promise
      jest.advanceTimersByTime(500)
      
      const issues = await promise
      
      expect(issues).toHaveLength(2)
      expect(issues[0].id).toBe("1")
      expect(issues[1].id).toBe("2")
    })
  })

  describe("mockFetchIssue", () => {
    test("fetches specific issue successfully", async () => {
      const promise = mockFetchIssue("1")
      
      jest.advanceTimersByTime(500)
      
      const issue = await promise
      
      expect(issue.id).toBe("1")
      expect(issue.title).toBe("Test Issue 1")
      expect(issue.status).toBe("Backlog")
    })

    test("rejects when issue not found", async () => {
      const promise = mockFetchIssue("999")
      
      jest.advanceTimersByTime(500)
      
      await expect(promise).rejects.toThrow("Issue not found")
    })
  })

  describe("mockUpdateIssue", () => {
    test("updates issue successfully", async () => {
      const updates = { title: "Updated Title", status: "Done" as const }
      const promise = mockUpdateIssue("1", updates)
      
      jest.advanceTimersByTime(500)
      
      const updatedIssue = await promise
      
      expect(updatedIssue.id).toBe("1")
      expect(updatedIssue.title).toBe("Updated Title")
      expect(updatedIssue.status).toBe("Done")
    })

    test("rejects with network error occasionally", async () => {
      // Mock Math.random to return a value that triggers the error
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.99) // 99% chance of error
      
      const promise = mockUpdateIssue("1", { title: "Test" })
      
      jest.advanceTimersByTime(500)
      
      await expect(promise).rejects.toThrow("Network error: Failed to update issue")
      
      // Restore original Math.random
      Math.random = originalRandom
    })

    test("succeeds most of the time", async () => {
      // Mock Math.random to return a value that triggers success
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.5) // 50% chance of success
      
      const promise = mockUpdateIssue("1", { title: "Test" })
      
      jest.advanceTimersByTime(500)
      
      const result = await promise
      expect(result.id).toBe("1")
      expect(result.title).toBe("Test")
      
      // Restore original Math.random
      Math.random = originalRandom
    })
  })
})

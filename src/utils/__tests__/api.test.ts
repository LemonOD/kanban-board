import { calculatePriorityScore } from "../api"
import type { Issue } from "../../types"
import { jest } from "@jest/globals"

describe("Priority Score Calculation", () => {
  const baseIssue: Issue = {
    id: "test-1",
    title: "Test Issue",
    status: "Backlog",
    priority: "medium",
    severity: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    assignee: "Test User",
    tags: ["test"],
    userDefinedRank: 0,
  }

  beforeAll(() => {
    // Mock Date.now() to return a consistent timestamp for testing
    jest.spyOn(Date, "now").mockReturnValue(new Date("2024-01-11T00:00:00.000Z").getTime())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test("calculates priority score correctly with base formula", () => {
    const issue = { ...baseIssue }
    const score = calculatePriorityScore(issue)

    // severity * 10 + (daysSinceCreated * -1) + userDefinedRank
    // 2 * 10 + (10 * -1) + 0 = 20 - 10 + 0 = 10
    expect(score).toBe(10)
  })

  test("calculates priority score with high severity", () => {
    const issue = { ...baseIssue, severity: 3 }
    const score = calculatePriorityScore(issue)

    // 3 * 10 + (10 * -1) + 0 = 30 - 10 + 0 = 20
    expect(score).toBe(20)
  })

  test("calculates priority score with low severity", () => {
    const issue = { ...baseIssue, severity: 1 }
    const score = calculatePriorityScore(issue)

    // 1 * 10 + (10 * -1) + 0 = 10 - 10 + 0 = 0
    expect(score).toBe(0)
  })

  test("calculates priority score with user defined rank", () => {
    const issue = { ...baseIssue, userDefinedRank: 5 }
    const score = calculatePriorityScore(issue)

    // 2 * 10 + (10 * -1) + 5 = 20 - 10 + 5 = 15
    expect(score).toBe(15)
  })

  test("calculates priority score for newer issue", () => {
    const issue = { ...baseIssue, createdAt: "2024-01-10T00:00:00.000Z" }
    const score = calculatePriorityScore(issue)

    // 2 * 10 + (1 * -1) + 0 = 20 - 1 + 0 = 19
    expect(score).toBe(19)
  })

  test("calculates priority score for older issue", () => {
    const issue = { ...baseIssue, createdAt: "2023-12-01T00:00:00.000Z" }
    const score = calculatePriorityScore(issue)

    // Days since created: 41 days
    // 2 * 10 + (41 * -1) + 0 = 20 - 41 + 0 = -21
    expect(score).toBe(-21)
  })

  test("handles missing userDefinedRank", () => {
    const issue = { ...baseIssue }
    delete issue.userDefinedRank
    const score = calculatePriorityScore(issue)

    // Should default to 0 for userDefinedRank
    // 2 * 10 + (10 * -1) + 0 = 10
    expect(score).toBe(10)
  })
})

describe("Issue Sorting Logic", () => {
  const createIssue = (id: string, severity: number, createdAt: string, userDefinedRank = 0): Issue => ({
    id,
    title: `Issue ${id}`,
    status: "Backlog",
    priority: "medium",
    severity,
    createdAt,
    assignee: "Test User",
    tags: [],
    userDefinedRank,
  })

  beforeAll(() => {
    jest.spyOn(Date, "now").mockReturnValue(new Date("2024-01-11T00:00:00.000Z").getTime())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test("sorts issues by priority score descending", () => {
    const issues = [
      createIssue("1", 1, "2024-01-01T00:00:00.000Z"), // Score: 0
      createIssue("2", 3, "2024-01-01T00:00:00.000Z"), // Score: 20
      createIssue("3", 2, "2024-01-01T00:00:00.000Z"), // Score: 10
    ]

    const sorted = issues.sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a))

    expect(sorted[0].id).toBe("2") // Highest score (20)
    expect(sorted[1].id).toBe("3") // Middle score (10)
    expect(sorted[2].id).toBe("1") // Lowest score (0)
  })

  test("sorts issues with same score by creation date (newer first)", () => {
    const issues = [
      createIssue("1", 2, "2024-01-01T00:00:00.000Z"), // Score: 10, older
      createIssue("2", 2, "2024-01-05T00:00:00.000Z"), // Score: 14, newer
    ]

    const sorted = issues.sort((a, b) => {
      const scoreA = calculatePriorityScore(a)
      const scoreB = calculatePriorityScore(b)

      if (scoreA === scoreB) {
        // If scores are equal, newer issues (higher timestamp) come first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      return scoreB - scoreA
    })

    expect(sorted[0].id).toBe("2") // Newer issue with higher score
    expect(sorted[1].id).toBe("1") // Older issue with lower score
  })

  test("complex sorting scenario with mixed scores and dates", () => {
    const issues = [
      createIssue("1", 1, "2024-01-01T00:00:00.000Z", 5), // Score: 5
      createIssue("2", 2, "2024-01-10T00:00:00.000Z", 0), // Score: 19
      createIssue("3", 3, "2024-01-05T00:00:00.000Z", -10), // Score: 14
      createIssue("4", 2, "2024-01-08T00:00:00.000Z", 0), // Score: 17
    ]

    const sorted = issues.sort((a, b) => {
      const scoreA = calculatePriorityScore(a)
      const scoreB = calculatePriorityScore(b)

      if (scoreA === scoreB) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      return scoreB - scoreA
    })

    expect(sorted[0].id).toBe("2") // Score: 19
    expect(sorted[1].id).toBe("4") // Score: 17
    expect(sorted[2].id).toBe("3") // Score: 14
    expect(sorted[3].id).toBe("1") // Score: 5
  })
})

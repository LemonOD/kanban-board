import { useState } from "react"
import type { IssueFilters, IssueSortConfig } from "../types"

interface SearchAndFiltersProps {
  filters: IssueFilters
  sortConfig: IssueSortConfig
  onFiltersChange: (filters: IssueFilters) => void
  onSortChange: (sortConfig: IssueSortConfig) => void
  assignees: string[]
}

export const SearchAndFilters = ({
  filters,
  sortConfig,
  onFiltersChange,
  onSortChange,
  assignees,
}: SearchAndFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleAssigneeChange = (assignee: string) => {
    onFiltersChange({ ...filters, assignee })
  }

  const handleSeverityChange = (severity: string) => {
    const severityValue = severity === "" ? null : Number.parseInt(severity)
    onFiltersChange({ ...filters, severity: severityValue })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleSortChange = (field: IssueSortConfig["field"]) => {
    const direction = sortConfig.field === field && sortConfig.direction === "desc" ? "asc" : "desc"
    onSortChange({ field, direction })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      assignee: "",
      severity: null,
      tags: [],
    })
  }

  const hasActiveFilters = filters.search || filters.assignee || filters.severity !== null || filters.tags.length > 0

  const commonTags = ["auth", "bug", "performance", "ui", "feature", "security"]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-blue-600 hover:text-blue-800">
          {isExpanded ? "Hide" : "Show"} Filters
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div>
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {(["priority", "createdAt", "title"] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    sortConfig.field === field
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {field === "priority" ? "Priority Score" : field === "createdAt" ? "Date Created" : "Title"}
                  {sortConfig.field === field && (
                    <span className="ml-1">{sortConfig.direction === "desc" ? "↓" : "↑"}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              value={filters.assignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Assignees</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={filters.severity?.toString() || ""}
              onChange={(e) => handleSeverityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Severities</option>
              <option value="1">Low (1)</option>
              <option value="2">Medium (2)</option>
              <option value="3">High (3)</option>
            </select>
          </div>

          {/* Tag Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.tags.includes(tag)
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-gray-200">
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800 font-medium">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

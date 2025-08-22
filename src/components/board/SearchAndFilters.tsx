import { useState, useRef, useEffect } from "react"
import type { IssueFilters, IssueSortConfig } from "../../types"
import { useTheme } from "../../contexts/ThemeContext"

interface SearchAndFiltersProps {
  filters: IssueFilters
  sortConfig: IssueSortConfig
  onFiltersChange: (filters: IssueFilters) => void
  onSortChange: (sortConfig: IssueSortConfig) => void
  assignees: string[]
}
function parseSeverity(severity: string): number | null {
  const num = parseInt(severity, 10)
  return severity === "" || isNaN(num) ? null : num
}

export const SearchAndFilters = ({
  filters,
  sortConfig,
  onFiltersChange,
  onSortChange,
  assignees,
}: SearchAndFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleAssigneeChange = (assignee: string) => {
    onFiltersChange({ ...filters, assignee })
  }

  const handleSeverityChange = (severity: string) => {
    onFiltersChange({ ...filters, severity: parseSeverity(severity) })
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
  const activeFilterCount = [
    filters.search,
    filters.assignee,
    filters.severity !== null,
    filters.tags.length > 0,
  ].filter(Boolean).length

  const severityOptions = [
  { value: "", label: "All Severities" },
  { value: "1", label: "Low (1)" },
  { value: "2", label: "Medium (2)" },
  { value: "3", label: "High (3)" },
]

  const commonTags = ["auth", "bug", "performance", "ui", "feature", "security"]

  return (
    <div className="relative " ref={dropdownRef}>
      {/* Search Bar and Filter Button */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-6 space-y-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {(["priority", "createdAt", "title"] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortConfig.field === field
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Assignee</label>
            <select
              value={filters.assignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Severity</label>
            <select
              value={filters.severity?.toString() || ""}
              onChange={(e) => handleSeverityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {severityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Tag Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.tags.includes(tag)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

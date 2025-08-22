import type React from "react"

import { useState } from "react"
import { Issue, IssueStatus } from "../../types"

interface CreateIssueModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateIssue: (issue: Omit<Issue, "id" | "createdAt">) => void
    defaultStatus: IssueStatus
}

export const CreateIssueModal = ({ isOpen, onClose, onCreateIssue, defaultStatus }: CreateIssueModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        assignee: "",
        priority: "medium" as Issue["priority"],
        severity: 2,
        tags: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim()) return

        const newIssue: Omit<Issue, "id" | "createdAt"> = {
            title: formData.title.trim(),
            status: defaultStatus,
            priority: formData.priority,
            severity: formData.severity,
            assignee: formData.assignee.trim() || "Unassigned",
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0),
        }

        onCreateIssue(newIssue)
        setFormData({
            title: "",
            assignee: "",
            priority: "medium",
            severity: 2,
            tags: "",
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New Issue</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter issue title"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                            Assignee
                        </label>
                        <input
                            type="text"
                            id="assignee"
                            value={formData.assignee}
                            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assignee name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Issue["priority"] })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                                Severity
                            </label>
                            <select
                                id="severity"
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: Number.parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>1 - Low</option>
                                <option value={2}>2 - Medium</option>
                                <option value={3}>3 - High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter tags separated by commas"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

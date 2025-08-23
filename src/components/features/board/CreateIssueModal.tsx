import type React from "react"

import { useState } from "react"
import { Issue, IssueStatus } from "../../../types"
import { AssigneeSelect } from "../../reusables/AssigneeSelect"
import { Button } from "../../reusables/Button"
import { PrioritySelect } from "../../reusables/PrioritySelect"
import { SeveritySelect } from "../../reusables/SeveritySelect"

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

    const uniqueAssignees = ["Alice", "Bob", "Charlie"] 

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
        <div 
        aria-modal="true" 
        role="dialog"
        aria-labelledby="modal-title" 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="modal-title" className="text-xl font-semibold">Create New Issue</h2>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="!p-1 !min-w-0 text-gray-400 hover:!text-gray-600 text-xl font-bold"
                        aria-label="Close modal"
                    >
                        x
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
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
                        <AssigneeSelect
                            assignees={uniqueAssignees}
                            value={formData.assignee}
                            onChange={(value: string) => setFormData({ ...formData, assignee: value })}
                            />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PrioritySelect
                            value={formData.priority}
                            onChange={(priority) => setFormData({ ...formData, priority: priority as Issue["priority"] })}
                            required={true}
                        />

                        <SeveritySelect
                            value={formData.severity}
                            onChange={(severity) => setFormData({ ...formData, severity: severity as number })}
                            required={true}
                        />
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
                        <Button type="button" onClick={onClose} variant="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Issue
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
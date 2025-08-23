import React from "react";

interface AssigneeSelectProps {
  assignees: string[];
  value: string;
  onChange: (assignee: string) => void;
  label?: string;
}

export const AssigneeSelect = ({ assignees, value, onChange, label = "Assignee" }: AssigneeSelectProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
);
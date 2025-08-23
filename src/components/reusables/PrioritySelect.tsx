import type React from "react"
import { Issue } from "../../types"

interface PrioritySelectProps {
    value: Issue["priority"] | string | null | undefined
    onChange: (value: Issue["priority"] | null) => void
    id?: string
    className?: string
    disabled?: boolean
    includeAllOption?: boolean
    required?: boolean
}

export const PrioritySelect = ({ 
    value, 
    onChange, 
    id = "priority", 
    className = "",
    disabled = false,
    includeAllOption = false,
    required = false
}: PrioritySelectProps) => {
    const basePriorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ] as const

    const priorityOptions = includeAllOption 
        ? [{ value: '', label: " All Priorities" }, ...basePriorityOptions]
        : basePriorityOptions

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value
        
        if (includeAllOption && selectedValue === "") {
            // Filter scenario: return null for "All"
            onChange(null)
        } else {
            // Form scenario: return the actual priority value
            onChange(selectedValue as Issue["priority"])
        }
    }

    const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
    const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName

    // Handle display value - convert null/undefined to empty string for select
    const displayValue = (value === null || value === undefined) ? "" : value

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                Priority 
            </label>
            <select
                id={id}
                value={displayValue}
                onChange={handleChange}
                className={combinedClassName}
                disabled={disabled}
                required={required}
            >
                {priorityOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
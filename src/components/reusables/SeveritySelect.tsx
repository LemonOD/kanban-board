import type React from "react"

interface SeveritySelectProps {
    value: number | null | undefined
    onChange: (value: number | null) => void
    id?: string
    className?: string
    disabled?: boolean
    includeAllOption?: boolean
    required?: boolean
}

export const SeveritySelect = ({ 
    value, 
    onChange, 
    id = "severity", 
    className = "",
    disabled = false,
    includeAllOption = false,
    required = false
}: SeveritySelectProps) => {
    const baseSeverityOptions = [
        { value: 1, label: "Low" },
        { value: 2, label: "Medium" },
        { value: 3, label: "High" },
    ] as const

    // Conditionally add "All" option for filtering scenarios
    const severityOptions = includeAllOption 
        ? [{ value: '', label: "All Severities" }, ...baseSeverityOptions]
        : baseSeverityOptions

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value
        
        if (includeAllOption && selectedValue === "") {
            onChange(null)
        } else {
            onChange(Number.parseInt(selectedValue))
        }
    }

    const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
    const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName

    // Handle display value - convert null/undefined to empty string for select
    const displayValue = (value === null || value === undefined) ? "" : value.toString()

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                Severity {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                value={displayValue}
                onChange={handleChange}
                className={combinedClassName}
                disabled={disabled}
                required={required}
            >
                {severityOptions.map((option) => (
                    <option key={option.value?.toString() || ""} value={option.value?.toString() || ""}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
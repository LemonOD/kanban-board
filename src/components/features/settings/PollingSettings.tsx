import React from "react";

type PollingSettingsProps = {
    pollingInterval: number;
    handlePollingIntervalChange: (interval: number) => void;
    isDark?: boolean;
};

const intervalOptions = [
    { value: 5, label: "5 seconds" },
    { value: 10, label: "10 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 300, label: "5 minutes" },
];

export const PollingSettings: React.FC<PollingSettingsProps> = ({
    pollingInterval,
    handlePollingIntervalChange,
    isDark = false,
}) => {
    const bgClass = isDark ? "bg-gray-900" : "bg-white";
    const textClass = isDark ? "text-gray-100" : "text-gray-900";
    const borderClass = isDark ? "border-gray-700" : "border-gray-200";
    const labelTextClass = isDark ? "text-gray-300" : "text-gray-700";
    const selectClass = isDark
        ? "bg-gray-800 text-gray-100 border-gray-700 "
        : "bg-white text-gray-900 border-gray-300";

    return (
        <div className={`${bgClass} rounded-lg border ${borderClass} shadow-sm p-6`}>
            <h2 className={`text-lg font-semibold ${textClass} mb-4`}>Polling Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium ${labelTextClass} mb-2`}>
                        Auto-refresh interval (seconds)
                    </label>
                    <div className="flex items-center space-x-4">
                        <select
                            value={pollingInterval}
                            onChange={(e) => handlePollingIntervalChange(Number(e.target.value))}
                            className={`px-3 py-2 border rounded-md focus:outline-none ${selectClass}`}
                        >
                            {intervalOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Issues will automatically refresh every {pollingInterval} seconds
                        </span>
                    </div>
                </div>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    The board automatically polls for updates to keep your view synchronized with the latest changes.
                </p>
            </div>
        </div>
    );
};
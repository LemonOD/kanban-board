import React from "react";

type PollingSettingsProps = {
  pollingInterval: number;
  handlePollingIntervalChange: (interval: number) => void;
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
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Polling Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Auto-refresh interval (seconds)
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={pollingInterval}
                onChange={(e) =>
                  handlePollingIntervalChange(Number(e.target.value))
                }
                className="appearance-none pr-8 pl-3 py-2 border rounded-md focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              >
                {intervalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Custom arrow */}
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Issues will automatically refresh every {pollingInterval} seconds
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The board automatically polls for updates to keep your view
          synchronized with the latest changes.
        </p>
      </div>
    </div>
  );
};

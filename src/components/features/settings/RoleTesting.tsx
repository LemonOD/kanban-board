import React, { useCallback } from "react";

type Role = "admin" | "contributor";

const ROLES: Role[] = ["admin", "contributor"];

interface RoleTestingProps {
  user: { role: Role };
  onRoleSwitch: (role: Role) => void;
}

export const RoleTesting: React.FC<RoleTestingProps> = ({ user, onRoleSwitch }) => {
  const handleRoleSwitch = useCallback(
    (role: Role) => {
      if (role !== user.role) {
        onRoleSwitch(role);
      }
    },
    [user.role, onRoleSwitch]
  );

  return (
    <div className="rounded-lg border p-6 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Development Role Switching
      </h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Switch between admin and contributor roles to test different permission levels. This setting is saved
          locally for development purposes.
        </p>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</span>
          <div className="flex space-x-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  user.role === role
                    ? role === "admin"
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded p-3 bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Current Role:</span>
            <span className="text-sm font-mono text-green-600 dark:text-green-400">"{user.role}"</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Role changes take effect immediately and persist across browser sessions.
          </p>
        </div>
      </div>
    </div>
  );
};

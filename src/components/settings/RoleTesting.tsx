import React, { useCallback } from "react";

type Role = "admin" | "contributor";

const ROLES: Role[] = ["admin", "contributor"];

interface RoleTestingProps {
    user: { role: Role };
    isDark: boolean;
    onRoleSwitch: (role: Role) => void;
}

export const RoleTesting: React.FC<RoleTestingProps> = ({ user, isDark, onRoleSwitch }) => {
    const handleRoleSwitch = useCallback(
        (role: Role) => {
            if (role !== user.role) {
                onRoleSwitch(role);
            }
        },
        [user.role, onRoleSwitch]
    );

    return (
        <div className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} rounded-lg border p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
                Development Role Switching
            </h2>
            <div className="space-y-4">
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Switch between admin and contributor roles to test different permission levels. This setting is saved
                    locally for development purposes.
                </p>

                <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Role:</span>
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
                                        : isDark
                                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border rounded p-3`}>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Current Role:</span>
                        <span className={`text-sm font-mono ${isDark ? "text-green-400" : "text-green-600"}`}>"{user.role}"</span>
                    </div>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Role changes take effect immediately and persist across browser sessions.
                    </p>
                </div>
            </div>
        </div>
    );
};
import React from "react";

type UserRole = "admin" | "contributor";

interface RoleInformationProps {
    user: {
        role: UserRole;
    };
    isDark: boolean;
}

const adminPermissions = [
    "Move issues between columns",
    "Update issue priority and status",
    "Mark issues as resolved",
    "Full read and write access",
];

const contributorPermissions = [
    { text: "View all issues and details", allowed: true },
    { text: "Search and filter issues", allowed: true },
    { text: "Access recently viewed issues", allowed: true },
    { text: "Cannot modify issues", allowed: false },
];

const RoleInformation: React.FC<RoleInformationProps> = ({ user, isDark }) => (
    <div className={`${isDark ? "bg-gray-900 border-gray-700 shadow-none" : "bg-white border-gray-200 shadow-sm"} rounded-lg border p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Role Permissions</h2>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h3 className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Admin Permissions</h3>
                    <ul className="space-y-2 text-sm">
                        {adminPermissions.map((perm) => (
                            <li key={perm} className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className={isDark ? "text-gray-100" : ""}>{perm}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Contributor Permissions</h3>
                    <ul className="space-y-2 text-sm">
                        {contributorPermissions.map(({ text, allowed }) => (
                            <li key={text} className="flex items-center space-x-2">
                                <svg
                                    className={`w-4 h-4 ${allowed ? "text-green-500" : "text-red-500"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    {allowed ? (
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    ) : (
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    )}
                                </svg>
                                <span className={`${allowed ? (isDark ? "text-gray-100" : "") : (isDark ? "text-gray-400" : "text-gray-500")}`}>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {user.role === "contributor" && (
                <div className={`mt-4 p-4 rounded-lg border ${isDark ? "bg-blue-950 border-blue-900" : "bg-blue-50 border-blue-200"}`}>
                    <div className="flex items-start space-x-3">
                        <svg className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-500"} mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className={`font-medium ${isDark ? "text-blue-200" : "text-blue-900"}`}>Read-Only Access</h4>
                            <p className={`text-sm mt-1 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                                You have contributor access, which means you can view and search issues but cannot modify them.
                                Contact an administrator if you need to make changes.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default RoleInformation;
import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "left" | "right"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const Button = ({
  variant = "secondary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md focus:outline-none font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
    secondary: "text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
    ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ",
    outline: "border border-current text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ",
    left:"px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
    right:"px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50  text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors ml-auto"
  }

  const combinedClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  )
}
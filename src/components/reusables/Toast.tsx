import { useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  onUndo?: () => void
  onDismiss: () => void
  duration?: number
}

export const Toast = ({ message, type = "info", onUndo, onDismiss, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  const getToastStyles = () => {
    const baseStyles = "px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300"
    
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-600 text-white`
      case "error":
        return `${baseStyles} bg-red-600 text-white`
      case "warning":
        return `${baseStyles} bg-yellow-600 text-white`
      case "info":
      default:
        return `${baseStyles} bg-gray-800 text-white`
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="px-3 py-1 bg-white/20 text-white rounded text-sm hover:bg-white/30 transition-colors font-medium"
        >
          Undo
        </button>
      )}
      <button 
        onClick={onDismiss} 
        className="text-white/70 hover:text-white transition-colors ml-2" 
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

import { useEffect } from "react"

interface UndoToastProps {
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export const UndoToast = ({ message, onUndo, onDismiss }: UndoToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50">
      <span className="text-sm">{message}</span>
      <button
        onClick={onUndo}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Undo
      </button>
      <button onClick={onDismiss} className="text-gray-300 hover:text-white transition-colors" aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}

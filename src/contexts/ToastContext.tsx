import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { Toast, type ToastType } from "../components/reusables/Toast"

interface ToastMessage {
  id: string
  message: string
  type: ToastType
  onUndo?: () => void
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, onUndo?: () => void, duration?: number) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = useCallback((
    message: string,
    type: ToastType = "info",
    onUndo?: () => void,
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToast({ id, message, type, onUndo, duration })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast])
  const showError   = useCallback((message: string) => showToast(message, "error"), [showToast])
  const showWarning = useCallback((message: string) => showToast(message, "warning"), [showToast])
  const showInfo    = useCallback((message: string) => showToast(message, "info"), [showToast])

  const contextValue = useMemo(() => ({
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }), [showToast, showSuccess, showError, showWarning, showInfo])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 toast-container space-y-2">
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onUndo={toast.onUndo}
            onDismiss={dismissToast}
            duration={toast.duration}
          />
        )}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}

import React, { createContext, useContext, useEffect, useState } from "react"

const POLLING_INTERVAL_KEY = "pollingInterval"
const DEFAULT_INTERVAL = 10000 // ms

type PollingContextType = {
  pollingInterval: number
  setPollingInterval: (interval: number) => void
}

const PollingContext = createContext<PollingContextType | undefined>(undefined)

export const PollingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollingInterval, setPollingIntervalState] = useState<number>(() => {
    const stored = localStorage.getItem(POLLING_INTERVAL_KEY)
    const parsed = stored ? parseInt(stored, 10) : NaN
    return !isNaN(parsed) && parsed > 0 ? parsed * 1000 : DEFAULT_INTERVAL
  })

  const setPollingInterval = (interval: number) => {
    setPollingIntervalState(interval * 1000) // keep ms internally
    localStorage.setItem(POLLING_INTERVAL_KEY, interval.toString())

    // cross-tab + cross-route sync
    window.dispatchEvent(
      new CustomEvent("localstorage-changed", { detail: { key: POLLING_INTERVAL_KEY, value: interval.toString() } })
    )
  }

  // listen for localStorage / custom event
  useEffect(() => {
    const handleChange = (e: StorageEvent | Event) => {
      let newVal: string | null = null
      if (e instanceof StorageEvent && e.key === POLLING_INTERVAL_KEY) {
        newVal = e.newValue
      } else if (e instanceof CustomEvent && e.detail.key === POLLING_INTERVAL_KEY) {
        newVal = e.detail.value
      }
      if (newVal) {
        const parsed = parseInt(newVal, 10)
        if (!isNaN(parsed) && parsed > 0) {
          setPollingIntervalState(parsed * 1000)
        }
      }
    }

    window.addEventListener("storage", handleChange)
    window.addEventListener("localstorage-changed", handleChange as EventListener)

    return () => {
      window.removeEventListener("storage", handleChange)
      window.removeEventListener("localstorage-changed", handleChange as EventListener)
    }
  }, [])

  return (
    <PollingContext.Provider value={{ pollingInterval, setPollingInterval }}>
      {children}
    </PollingContext.Provider>
  )
}

export const usePollingContext = () => {
  const ctx = useContext(PollingContext)
  if (!ctx) throw new Error("usePollingContext must be used within PollingProvider")
  return ctx
}

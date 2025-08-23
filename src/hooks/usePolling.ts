import { useEffect, useRef } from "react"

export function usePolling(callback: () => void, interval: number | null = 10000) {
  const savedCallback = useRef<(() => void) | null>(null) // ✅ provide initial value

  // Save latest callback into ref
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (interval === null) return

    const tick = () => {
      savedCallback.current?.()
    }

    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [interval])
}

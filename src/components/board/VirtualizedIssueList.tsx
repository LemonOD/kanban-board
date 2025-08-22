import type React from "react"

import { useMemo, useState, useEffect, useRef } from "react"
import type { Issue, IssueStatus } from "../../types"
import { IssueCard } from "./IssueCard"

interface VirtualizedIssueListProps {
  issues: Issue[]
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void
  canMoveIssues: boolean
}

const ITEM_HEIGHT = 120 // Approximate height of each issue card
const BUFFER_SIZE = 5 // Number of items to render outside visible area

export const VirtualizedIssueList = ({ issues, onStatusChange, canMoveIssues }: VirtualizedIssueListProps) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateHeight = () => {
      setContainerHeight(container.clientHeight)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    if (containerHeight === 0) {
      return { visibleItems: issues.slice(0, 10), totalHeight: issues.length * ITEM_HEIGHT, offsetY: 0 }
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE)
    const endIndex = Math.min(issues.length, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE)

    return {
      visibleItems: issues.slice(startIndex, endIndex).map((issue, index) => ({
        ...issue,
        virtualIndex: startIndex + index,
      })),
      totalHeight: issues.length * ITEM_HEIGHT,
      offsetY: startIndex * ITEM_HEIGHT,
    }
  }, [issues, scrollTop, containerHeight])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
          className="p-4 space-y-3"
        >
          {visibleItems.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onStatusChange={onStatusChange} canMoveIssues={canMoveIssues} />
          ))}
        </div>
      </div>
    </div>
  )
}
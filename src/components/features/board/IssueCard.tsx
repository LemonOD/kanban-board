import { useNavigate } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import { calculatePriorityScore } from "../../../utils/api";
import { Issue, IssueStatus } from "../../../types";
import { addRecentlyAccessedIssue } from "../../../utils/localStorage";
import { Button } from "../../reusables/Button"; // Make sure this path is correct

interface IssueCardProps {
  issue: Issue;
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
  canMoveIssues: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
  low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
};

const NEXT_STATUS: Record<IssueStatus, IssueStatus | null> = {
  Backlog: "In Progress",
  "In Progress": "Done",
  Done: null,
};

const PREVIOUS_STATUS: Record<IssueStatus, IssueStatus | null> = {
  Backlog: null,
  "In Progress": "Backlog",
  Done: "In Progress",
};

export const IssueCard = ({
  issue,
  onStatusChange,
  canMoveIssues,
}: IssueCardProps) => {
  const priorityScore = calculatePriorityScore(issue);
  const router = useNavigate();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    disabled: !canMoveIssues,
  });

  const style: React.CSSProperties | undefined = transform
  ? isDragging
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 9999,
        position: "fixed",
        width: "350px",
      }
    : {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "relative",
        zIndex: "auto",
        width: "auto",
        pointerEvents: "auto",
      }
  : undefined;


  const getPriorityColor = (priority: string) =>
    PRIORITY_COLORS[priority] || PRIORITY_COLORS.default;

  const nextStatus = NEXT_STATUS[issue.status];
  const previousStatus = PREVIOUS_STATUS[issue.status];

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    addRecentlyAccessedIssue({ id: issue.id, title: issue.title });
    router(`/issue/${issue.id}`);
  };

  const handleStatus = (e: React.MouseEvent, status: IssueStatus) => {
    e.stopPropagation();
    onStatusChange(issue.id, status);
  };

  const cardClasses =
    "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow" +
    (isDragging ? " opacity-50 rotate-2 scale-105" : "") +
    (canMoveIssues ? " cursor-grab active:cursor-grabbing" : "");

  return (
    <div
      onClick={handleCardClick}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      data-draggable="true"
      role="button"
      data-dragging={isDragging}
      aria-label={`View details for issue ${issue.title}`}
      className={isDragging ? "z-[9998]" : ""}
      tabIndex={0}
    >
      <div className={cardClasses}>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
              #{issue.id}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Score: {priorityScore}</span>
            </div>
          </div>

          <div className="block text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
            <h3 className="font-medium text-sm leading-tight truncate">{issue.title}</h3>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Assigned to: {issue.assignee}</span>
            <span>Severity: {issue.severity}</span>
          </div>

          {issue.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {issue.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {canMoveIssues && (
            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              {previousStatus && (
                <Button
                  type="button"
                  variant="left"
                  onClick={(e) => handleStatus(e, previousStatus)}
                >
                  ← {previousStatus}
                </Button>
              )}
              {nextStatus && (
                <Button
                  type="button"
                  variant="right"
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50  text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 
                          dark:hover:bg-blue-800/50 transition-colors ml-auto"
                  onClick={(e) => handleStatus(e, nextStatus)}
                >
                  {nextStatus} →
                </Button>
              )}
            </div>
            
          )}

        </div>
      </div>
    </div>
  );
};
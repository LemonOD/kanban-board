import { useEffect, useState } from "react";

export function useRelativeTime(date: Date | null) {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!date) return;
    const timer = setInterval(() => rerender(x => x + 1), 3000); // Update every 3 seconds
    return () => clearInterval(timer);
  }, [date]);

  if (!date) return null;

 const diff = Math.floor((Date.now() - date.getTime()) / 1000); // in seconds
  if (diff < 3) return "just now";              // 0–3s
  if (diff < 60) return `${diff} sec ago`;      // under a minute
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} d ago`;
}

import { useEffect, useState } from "react";

export function useRelativeTime(date: Date | null) {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!date) return;
    const timer = setInterval(() => rerender(x => x + 1), 60_000);
    return () => clearInterval(timer);
  }, [date]);

  if (!date) return null;

 const diff = Math.floor((Date.now() - date.getTime()) / 1000); // in seconds
  if (diff < 5) return "just now";              // 0–4s
  if (diff < 60) return `${diff} sec ago`;      // under a minute
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

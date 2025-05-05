/**
 * Utility functions for date handling
 */
export function isDateExpired(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  const date = new Date(dateString);
  return date < today;
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export function getRelativeTimeFromNow(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Calculate difference in days
  const diffTime = Math.abs(date.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return date > now ? "Tomorrow" : "Yesterday";
  if (diffDays < 7) return `${diffDays} days ${date > now ? "from now" : "ago"}`;

  return formatDate(dateString);
}

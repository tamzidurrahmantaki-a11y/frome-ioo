import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSentenceCase(str: string) {
  if (!str) return ""
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatRelativeTime(date: Date | string) {
  if (!date) return 'No clicks yet'
  const d = new Date(date)
  return formatDistanceToNow(d, { addSuffix: true })
    .replace('about ', '')
    .replace('less than a minute ago', 'Just now')
    .replace(' minutes', 'min')
    .replace(' minute', 'min')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
}

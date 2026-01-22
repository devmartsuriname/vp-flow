import type { CaseStatus, CasePriority } from './types'

// Bootstrap badge variants for each status
export const STATUS_BADGE_VARIANTS: Record<CaseStatus, string> = {
  draft: 'secondary',
  open: 'primary',
  in_progress: 'info',
  parked: 'warning',
  closed: 'success',
  reopened: 'info',
}

// Human-readable status labels
export const STATUS_LABELS: Record<CaseStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  in_progress: 'In Progress',
  parked: 'Parked',
  closed: 'Closed',
  reopened: 'Reopened',
}

// Bootstrap badge variants for priority
export const PRIORITY_BADGE_VARIANTS: Record<CasePriority, string> = {
  high: 'danger',
  medium: 'warning',
  low: 'secondary',
}

// Human-readable priority labels
export const PRIORITY_LABELS: Record<CasePriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

// Priority options for select
export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
] as const

// Format date for display (YYYY-MM-DD to readable)
export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Check if a date is overdue (past today)
export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false
  const deadline = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)
  return deadline < today
}

// Format datetime for display
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Format relative time (e.g., "2 hours ago", "Yesterday")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) === 1 ? '' : 's'} ago`
  return formatDateTime(dateString)
}

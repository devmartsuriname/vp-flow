import type { AppointmentStatus, AppointmentVisibility } from './types'

// Bootstrap badge variants for each status
export const STATUS_BADGE_VARIANTS: Record<AppointmentStatus, string> = {
  draft: 'secondary',
  pending_vp: 'warning',
  approved: 'success',
  rejected: 'danger',
  rescheduled: 'info',
  cancelled: 'dark',
  completed: 'primary',
}

// Human-readable status labels
export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  draft: 'Draft',
  pending_vp: 'Pending VP',
  approved: 'Approved',
  rejected: 'Rejected',
  rescheduled: 'Rescheduled',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

// Duration options in minutes
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
] as const

// Visibility labels
export const VISIBILITY_LABELS: Record<AppointmentVisibility, string> = {
  vp_secretary: 'VP & Secretary',
  vp_only: 'VP Only',
}

// Format date for display (YYYY-MM-DD to readable)
export function formatDate(dateString: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format time for display (HH:MM:SS to readable)
export function formatTime(timeString: string): string {
  if (!timeString) return '—'
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Format duration for display
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours} hr`
  return `${hours} hr ${remainingMinutes} min`
}

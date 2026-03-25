import type { IncomingPostStatus, IncomingPostUrgency, IncomingPostCategory } from './types'

// Status badge variants (Bootstrap)
export const STATUS_BADGE_VARIANTS: Record<IncomingPostStatus, string> = {
  received: 'secondary',
  registered: 'primary',
  waiting_advice: 'warning',
  advice_received: 'info',
  forwarded: 'success',
  rejected: 'danger',
  appointment_created: 'info',
  closed: 'dark',
  archived: 'secondary',
}

// Status labels
export const STATUS_LABELS: Record<IncomingPostStatus, string> = {
  received: 'Received',
  registered: 'Registered',
  waiting_advice: 'Waiting Advice',
  advice_received: 'Advice Received',
  forwarded: 'Forwarded',
  rejected: 'Rejected',
  appointment_created: 'Appointment Created',
  closed: 'Closed',
  archived: 'Archived',
}

// Urgency badge variants
export const URGENCY_BADGE_VARIANTS: Record<IncomingPostUrgency, string> = {
  normal: 'secondary',
  urgent: 'danger',
  confidential: 'warning',
}

// Urgency labels
export const URGENCY_LABELS: Record<IncomingPostUrgency, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
  confidential: 'Confidential',
}

// Category labels
export const CATEGORY_LABELS: Record<IncomingPostCategory, string> = {
  letter: 'Letter',
  memo: 'Memo',
  invitation: 'Invitation',
  legal: 'Legal',
  report: 'Report',
  other: 'Other',
}

// Filter options
export const STATUS_FILTER_OPTIONS: { value: IncomingPostStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'received', label: 'Received' },
  { value: 'registered', label: 'Registered' },
  { value: 'waiting_advice', label: 'Waiting Advice' },
  { value: 'advice_received', label: 'Advice Received' },
  { value: 'forwarded', label: 'Forwarded' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'appointment_created', label: 'Appointment Created' },
  { value: 'closed', label: 'Closed' },
  { value: 'archived', label: 'Archived' },
]

export const CATEGORY_FILTER_OPTIONS: { value: IncomingPostCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'letter', label: 'Letter' },
  { value: 'memo', label: 'Memo' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'legal', label: 'Legal' },
  { value: 'report', label: 'Report' },
  { value: 'other', label: 'Other' },
]

export const URGENCY_FILTER_OPTIONS: { value: IncomingPostUrgency | ''; label: string }[] = [
  { value: '', label: 'All Urgency' },
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'confidential', label: 'Confidential' },
]

// Format date
export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format datetime
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

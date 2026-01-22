import type { DocumentEntityType } from './types'

// Entity type options for filtering
export const ENTITY_TYPE_OPTIONS: { value: DocumentEntityType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'case', label: 'Cases' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'guest', label: 'Guests' },
  { value: 'none', label: 'Unlinked' },
]

// Entity type labels
export const ENTITY_TYPE_LABELS: Record<DocumentEntityType, string> = {
  case: 'Case',
  appointment: 'Appointment',
  guest: 'Guest',
  none: 'Unlinked',
}

// Format date for display
export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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

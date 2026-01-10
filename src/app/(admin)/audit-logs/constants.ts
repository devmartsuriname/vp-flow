import type { AuditAction } from './types'

export const ACTION_BADGE_VARIANTS: Record<AuditAction, string> = {
  create: 'success',
  update: 'info',
  status_change: 'primary',
  pdf_generate: 'secondary',
  priority_change: 'warning',
  deadline_change: 'warning',
}

export const ACTION_LABELS: Record<AuditAction, string> = {
  create: 'Created',
  update: 'Updated',
  status_change: 'Status Change',
  pdf_generate: 'PDF Generated',
  priority_change: 'Priority Change',
  deadline_change: 'Deadline Change',
}

export const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'All Entities' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'cases', label: 'Cases' },
  { value: 'clients', label: 'Clients' },
]

export const ACTION_OPTIONS: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'status_change', label: 'Status Change' },
  { value: 'pdf_generate', label: 'PDF Generated' },
  { value: 'priority_change', label: 'Priority Change' },
  { value: 'deadline_change', label: 'Deadline Change' },
]

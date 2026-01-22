import type { AuditAction } from './types'

export const ACTION_BADGE_VARIANTS: Record<AuditAction, string> = {
  create: 'success',
  update: 'info',
  status_change: 'primary',
  pdf_generate: 'secondary',
  priority_change: 'warning',
  deadline_change: 'warning',
  case_reopened: 'info',
  case_reopen_edit: 'info',
  case_reclosed: 'success',
  document_linked: 'primary',
  document_viewed: 'secondary',
  document_downloaded: 'secondary',
  document_deactivated: 'warning',
}

export const ACTION_LABELS: Record<AuditAction, string> = {
  create: 'Created',
  update: 'Updated',
  status_change: 'Status Change',
  pdf_generate: 'PDF Generated',
  priority_change: 'Priority Change',
  deadline_change: 'Deadline Change',
  case_reopened: 'Case Reopened',
  case_reopen_edit: 'Reopen Edit',
  case_reclosed: 'Case Re-closed',
  document_linked: 'Document Linked',
  document_viewed: 'Document Viewed',
  document_downloaded: 'Document Downloaded',
  document_deactivated: 'Document Deactivated',
}

export const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'All Entities' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'cases', label: 'Cases' },
  { value: 'clients', label: 'Clients' },
  { value: 'documents', label: 'Documents' },
  { value: 'document_links', label: 'Document Links' },
]

export const ACTION_OPTIONS: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'status_change', label: 'Status Change' },
  { value: 'pdf_generate', label: 'PDF Generated' },
  { value: 'priority_change', label: 'Priority Change' },
  { value: 'deadline_change', label: 'Deadline Change' },
  { value: 'case_reopened', label: 'Case Reopened' },
  { value: 'case_reopen_edit', label: 'Reopen Edit' },
  { value: 'case_reclosed', label: 'Case Re-closed' },
  { value: 'document_linked', label: 'Document Linked' },
  { value: 'document_viewed', label: 'Document Viewed' },
  { value: 'document_downloaded', label: 'Document Downloaded' },
  { value: 'document_deactivated', label: 'Document Deactivated' },
]

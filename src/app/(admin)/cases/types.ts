import type { Database } from '@/integrations/supabase/types'

// Case type from database
export type Case = Database['public']['Tables']['cases']['Row']
export type CaseInsert = Database['public']['Tables']['cases']['Insert']
export type CaseUpdate = Database['public']['Tables']['cases']['Update']

// Enums from database
export type CaseStatus = Database['public']['Enums']['case_status']
export type CasePriority = Database['public']['Enums']['case_priority']

// Appointment type for joined queries
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Client = Database['public']['Tables']['clients']['Row']

// Case with appointment and client join for display
export type CaseWithAppointment = Case & {
  appointments: {
    id: string
    subject: string
    scheduled_date: string
    scheduled_time: string
    clients: {
      id: string
      first_name: string | null
      last_name: string | null
      organization_name: string | null
      client_type: Database['public']['Enums']['client_type']
    } | null
  } | null
}

// Form data for create/edit operations
export interface CaseFormData {
  title: string
  description: string
  priority: CasePriority
  deadline: string | null
  appointment_id: string | null
  vp_notes: string
}

// Helper to get client display name from appointment
export function getClientDisplayName(
  appointments: CaseWithAppointment['appointments']
): string {
  if (!appointments?.clients) return 'No Client Linked'
  const client = appointments.clients
  if (client.client_type === 'organization') {
    return client.organization_name || 'Unnamed Organization'
  }
  const firstName = client.first_name || ''
  const lastName = client.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Unnamed Person'
}

// Statuses that allow editing (anything except closed)
export const EDITABLE_STATUSES: CaseStatus[] = ['draft', 'open', 'in_progress', 'parked', 'reopened']

// Terminal status (no further actions)
export const TERMINAL_STATUSES: CaseStatus[] = ['closed']

// Check if case can be edited based on status
export function canEditCase(status: CaseStatus): boolean {
  return EDITABLE_STATUSES.includes(status)
}

// Check if case is closed
export function isCaseClosed(status: CaseStatus): boolean {
  return status === 'closed'
}

// Timeline event types for Case History
export type TimelineEventType = 
  | 'created' 
  | 'opened' 
  | 'status_change' 
  | 'priority_change' 
  | 'deadline_change' 
  | 'closed' 
  | 'updated'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  description: string
  timestamp: string
  actorName?: string
  oldValue?: string
  newValue?: string
  source: 'case_field' | 'audit_event'
}

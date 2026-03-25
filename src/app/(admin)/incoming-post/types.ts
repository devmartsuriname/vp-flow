import type { Database } from '@/integrations/supabase/types'

// Incoming Post status enum
export type IncomingPostStatus = Database['public']['Enums']['incoming_post_status']
export type IncomingPostUrgency = Database['public']['Enums']['incoming_post_urgency']
export type IncomingPostCategory = Database['public']['Enums']['incoming_post_category']

// Incoming Post row type (manual since types.ts is read-only and may not be regenerated yet)
export interface IncomingPost {
  id: string
  reference_number: string
  subject: string
  sender_name: string
  sender_organization: string | null
  received_date: string
  category: IncomingPostCategory
  urgency: IncomingPostUrgency
  status: IncomingPostStatus
  description: string | null
  advice_request: string | null
  advice_response: string | null
  forwarding_destination: string | null
  rejection_reason: string | null
  linked_appointment_id: string | null
  registered_by: string | null
  registered_at: string | null
  forwarded_by: string | null
  forwarded_at: string | null
  rejected_by: string | null
  rejected_at: string | null
  closed_by: string | null
  closed_at: string | null
  archived_by: string | null
  archived_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// Form data for create
export interface IncomingPostFormData {
  subject: string
  sender_name: string
  sender_organization: string
  received_date: string
  category: IncomingPostCategory
  urgency: IncomingPostUrgency
  description: string
}

// Transition table: from -> allowed destinations
export const STATUS_TRANSITIONS: Record<IncomingPostStatus, IncomingPostStatus[]> = {
  received: ['registered'],
  registered: ['forwarded', 'waiting_advice', 'rejected'],
  waiting_advice: ['advice_received'],
  advice_received: ['forwarded', 'rejected', 'appointment_created'],
  forwarded: ['appointment_created', 'closed'],
  rejected: ['closed'],
  appointment_created: ['closed'],
  closed: ['archived'],
  archived: [],
}

// VP-only transitions
export const VP_ONLY_TRANSITIONS: IncomingPostStatus[] = [
  'forwarded', 'waiting_advice', 'rejected', 'appointment_created', 'closed', 'archived',
]

// Check if a transition requires VP
export function isVPOnlyTransition(targetStatus: IncomingPostStatus): boolean {
  return VP_ONLY_TRANSITIONS.includes(targetStatus)
}

// Check if post can be edited (metadata)
export function canEditPost(status: IncomingPostStatus): boolean {
  return !['closed', 'archived'].includes(status)
}

// Check if post is archived (immutable)
export function isPostArchived(status: IncomingPostStatus): boolean {
  return status === 'archived'
}

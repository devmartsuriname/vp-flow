import type { Database } from '@/integrations/supabase/types'

// Appointment type from database
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

// Enums from database
export type AppointmentStatus = Database['public']['Enums']['appointment_status']
export type AppointmentVisibility = Database['public']['Enums']['appointment_visibility']

// Client type for joined queries
export type Client = Database['public']['Tables']['clients']['Row']

// Appointment with client join for list display
export type AppointmentWithClient = Appointment & {
  clients: {
    id: string
    first_name: string | null
    last_name: string | null
    organization_name: string | null
    client_type: Database['public']['Enums']['client_type']
  } | null
}

// Form data for create/edit operations
export interface AppointmentFormData {
  client_id: string
  subject: string
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  location: string
  description: string
  visibility: AppointmentVisibility
  vp_notes: string
}

// Helper to get client display name
export function getClientDisplayName(client: AppointmentWithClient['clients']): string {
  if (!client) return 'Unknown Client'
  if (client.client_type === 'organization') {
    return client.organization_name || 'Unnamed Organization'
  }
  const firstName = client.first_name || ''
  const lastName = client.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Unnamed Person'
}

// Statuses that allow editing
export const EDITABLE_STATUSES: AppointmentStatus[] = ['draft', 'pending_vp', 'approved', 'rescheduled']

// Statuses that are terminal (no further actions)
export const TERMINAL_STATUSES: AppointmentStatus[] = ['rejected', 'cancelled', 'completed']

// Check if appointment can be edited based on status
export function canEditAppointment(status: AppointmentStatus): boolean {
  return EDITABLE_STATUSES.includes(status)
}

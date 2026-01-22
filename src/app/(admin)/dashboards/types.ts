import type { Database } from '@/integrations/supabase/types'

export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Case = Database['public']['Tables']['cases']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type AppRole = Database['public']['Enums']['app_role']

export interface DashboardStats {
  totalClients: number
  openAppointments: number
  activeCases: number
  unreadNotifications: number
}

export interface KPICardData {
  title: string
  count: number
  icon: string
  color: string
  link?: string
}

export interface RecentAppointment extends Appointment {
  clients?: {
    first_name: string | null
    last_name: string | null
    organization_name: string | null
    client_type: string
  } | null
}

export interface RecentCase extends Case {}

export interface RecentClient extends Client {}

export interface RecentNote {
  id: string
  title: string | null
  updated_at: string
  note_link?: {
    entity_type: string
  } | null
}

export interface TodayNote extends RecentNote {
  appointment_subject?: string
}

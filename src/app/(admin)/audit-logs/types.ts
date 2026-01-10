import type { Database } from '@/integrations/supabase/types'

export type AuditEvent = Database['public']['Tables']['audit_events']['Row']
export type AuditAction = Database['public']['Enums']['audit_action']

export type AuditEventWithActor = AuditEvent & {
  user_profiles: {
    id: string
    full_name: string | null
  } | null
}

export interface AuditLogFilters {
  startDate: string | null
  endDate: string | null
  action: AuditAction | null
  entityType: string | null
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { AuditEventWithActor, AuditLogFilters, AuditAction, AuditEvent } from '../types'
import { useUserRole, isVP } from '@/hooks/useUserRole'

export function useAuditLogs(filters?: AuditLogFilters) {
  const { role } = useUserRole()

  return useQuery<AuditEventWithActor[], Error>({
    queryKey: ['audit-logs', filters, role],
    queryFn: async () => {
      // Only VP has access per RLS
      if (!isVP(role)) {
        return []
      }

      let query = supabase
        .from('audit_events')
        .select('*')
        .order('performed_at', { ascending: false })

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('performed_at', filters.startDate)
      }
      if (filters?.endDate) {
        // Add a day to include the end date fully
        const endDate = new Date(filters.endDate)
        endDate.setDate(endDate.getDate() + 1)
        query = query.lt('performed_at', endDate.toISOString())
      }
      if (filters?.action) {
        query = query.eq('action', filters.action as AuditAction)
      }
      if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType)
      }

      const { data, error } = await query.limit(100)

      if (error) {
        throw new Error(error.message)
      }

      const auditEvents = (data as AuditEvent[]) || []

      // Get unique user IDs to fetch profiles
      const userIds = [...new Set(auditEvents.map((e) => e.performed_by).filter(Boolean))]

      if (userIds.length === 0) {
        return auditEvents.map((e) => ({ ...e, user_profiles: null }))
      }

      // Fetch user profiles separately (no FK relationship)
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .in('id', userIds)

      if (profileError) {
        console.error('Error fetching user profiles:', profileError)
        // Continue without profiles rather than failing
        return auditEvents.map((e) => ({ ...e, user_profiles: null }))
      }

      // Map profiles to events
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])

      return auditEvents.map((event) => ({
        ...event,
        user_profiles: event.performed_by ? profileMap.get(event.performed_by) || null : null,
      }))
    },
    enabled: !!role && isVP(role),
  })
}

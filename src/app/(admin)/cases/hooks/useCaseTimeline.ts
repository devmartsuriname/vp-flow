import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { TimelineEvent, CaseWithAppointment } from '../types'
import type { VPFlowRole } from '@/types/auth'
import { isVP } from '@/hooks/useUserRole'

/**
 * Builds timeline events from case fields (available to all roles with case access)
 */
function buildCaseFieldEvents(caseItem: CaseWithAppointment): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Case created event
  if (caseItem.created_at) {
    events.push({
      id: `created-${caseItem.id}`,
      type: 'created',
      description: 'Case was created',
      timestamp: caseItem.created_at,
      source: 'case_field',
    })
  }

  // Case opened event
  if (caseItem.opened_at) {
    events.push({
      id: `opened-${caseItem.id}`,
      type: 'opened',
      description: 'Case was opened',
      timestamp: caseItem.opened_at,
      source: 'case_field',
    })
  }

  // Case closed event
  if (caseItem.closed_at) {
    events.push({
      id: `closed-${caseItem.id}`,
      type: 'closed',
      description: 'Case was closed',
      timestamp: caseItem.closed_at,
      source: 'case_field',
    })
  }

  return events
}

/**
 * Fetches audit events for a case (VP only due to RLS)
 */
async function fetchAuditEvents(caseId: string): Promise<TimelineEvent[]> {
  const { data: auditEvents, error } = await supabase
    .from('audit_events')
    .select('id, action, old_values, new_values, performed_at, performed_by')
    .eq('entity_type', 'cases')
    .eq('entity_id', caseId)
    .order('performed_at', { ascending: false })

  if (error || !auditEvents) {
    console.warn('Unable to fetch audit events (may be RLS blocked):', error?.message)
    return []
  }

  // Fetch user profiles for actor names
  const performerIds = [...new Set(auditEvents.map(e => e.performed_by).filter(Boolean))]
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .in('id', performerIds)

  const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

  return auditEvents.map(event => {
    const actorName = profileMap.get(event.performed_by) || undefined

    let type: TimelineEvent['type'] = 'updated'
    let description = 'Case was updated'
    let oldValue: string | undefined
    let newValue: string | undefined

    // Map audit action to timeline event type
    switch (event.action) {
      case 'create':
        type = 'created'
        description = 'Case was created'
        break
      case 'status_change':
        type = 'status_change'
        oldValue = (event.old_values as { status?: string })?.status
        newValue = (event.new_values as { status?: string })?.status
        if (newValue === 'closed') {
          type = 'closed'
          description = 'Case was closed'
        } else if (newValue === 'open' && !oldValue) {
          type = 'opened'
          description = 'Case was opened'
        } else {
          description = `Status changed${oldValue ? ` from ${oldValue}` : ''}${newValue ? ` to ${newValue}` : ''}`
        }
        break
      case 'priority_change':
        type = 'priority_change'
        oldValue = (event.old_values as { priority?: string })?.priority
        newValue = (event.new_values as { priority?: string })?.priority
        description = `Priority changed${oldValue ? ` from ${oldValue}` : ''}${newValue ? ` to ${newValue}` : ''}`
        break
      case 'deadline_change':
        type = 'deadline_change'
        oldValue = (event.old_values as { deadline?: string })?.deadline
        newValue = (event.new_values as { deadline?: string })?.deadline
        description = `Deadline ${newValue ? `set to ${newValue}` : 'removed'}${oldValue ? ` (was ${oldValue})` : ''}`
        break
      case 'update':
        type = 'updated'
        description = 'Case was updated'
        break
    }

    return {
      id: `audit-${event.id}`,
      type,
      description,
      timestamp: event.performed_at,
      actorName,
      oldValue,
      newValue,
      source: 'audit_event' as const,
    }
  })
}

/**
 * Hook to fetch case timeline events
 * VP sees audit events + case field events
 * Secretary sees only case field events (RLS blocks audit_events)
 */
export function useCaseTimeline(caseItem: CaseWithAppointment | null, userRole: VPFlowRole | null) {
  return useQuery({
    queryKey: ['case-timeline', caseItem?.id, userRole],
    queryFn: async (): Promise<TimelineEvent[]> => {
      if (!caseItem) return []

      // Build field-based events (available to all roles)
      const fieldEvents = buildCaseFieldEvents(caseItem)

      // VP gets audit events too
      if (isVP(userRole)) {
        const auditEvents = await fetchAuditEvents(caseItem.id)
        
        // Deduplicate: If we have an audit event for created/opened/closed, 
        // prefer the audit version (it may have actor info)
        const auditTypes = new Set(auditEvents.map(e => e.type))
        const filteredFieldEvents = fieldEvents.filter(e => !auditTypes.has(e.type))
        
        // Combine and sort by timestamp (newest first)
        const allEvents = [...auditEvents, ...filteredFieldEvents]
        allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        
        return allEvents
      }

      // Secretary/others only see field events
      fieldEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      return fieldEvents
    },
    enabled: !!caseItem && !!userRole,
  })
}

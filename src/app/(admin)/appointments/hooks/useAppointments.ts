import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { AppointmentWithClient } from '../types'
import type { VPFlowRole } from '@/types/auth'
import { isSecretary, isProtocol } from '@/hooks/useUserRole'

export const APPOINTMENTS_PAGE_SIZE = 20

export type AppointmentsPage = {
  rows: AppointmentWithClient[]
  count: number
}

export function useAppointments(role: VPFlowRole | null, page: number = 1) {

  return useQuery<AppointmentsPage, Error>({
    queryKey: ['appointments', role, page],
    queryFn: async () => {
      const from = (page - 1) * APPOINTMENTS_PAGE_SIZE
      const to = from + APPOINTMENTS_PAGE_SIZE - 1

      let query = supabase
        .from('appointments')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            organization_name,
            client_type
          )
        `, { count: 'exact' })
        .order('scheduled_date', { ascending: false })
        .order('scheduled_time', { ascending: false })

      // Role-based filtering (RLS handles security, this is for UI)
      if (isProtocol(role)) {
        // Protocol only sees approved appointments
        query = query.eq('status', 'approved')
      } else if (isSecretary(role)) {
        // Secretary sees all except vp_only visibility
        query = query.neq('visibility', 'vp_only')
      }
      // VP sees all - no filter needed

      const { data, error, count } = await query.range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        rows: (data as AppointmentWithClient[]) || [],
        count: count ?? 0,
      }
    },
    enabled: !!role,
  })
}

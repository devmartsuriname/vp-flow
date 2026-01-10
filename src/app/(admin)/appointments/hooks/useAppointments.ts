import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { AppointmentWithClient } from '../types'
import { useUserRole, isVP, isSecretary, isProtocol } from '@/hooks/useUserRole'

export function useAppointments() {
  const { role } = useUserRole()

  return useQuery<AppointmentWithClient[], Error>({
    queryKey: ['appointments', role],
    queryFn: async () => {
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
        `)
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

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return (data as AppointmentWithClient[]) || []
    },
    enabled: !!role,
  })
}

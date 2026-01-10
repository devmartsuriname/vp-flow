import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { CaseWithAppointment } from '../types'
import { useUserRole, isVP, isSecretary, isProtocol } from '@/hooks/useUserRole'

export function useCases() {
  const { role } = useUserRole()

  return useQuery<CaseWithAppointment[], Error>({
    queryKey: ['cases', role],
    queryFn: async () => {
      // Protocol has NO access to cases (RLS blocks, but UI also filters)
      if (isProtocol(role)) {
        return []
      }

      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          appointments (
            id,
            subject,
            scheduled_date,
            scheduled_time,
            clients (
              id,
              first_name,
              last_name,
              organization_name,
              client_type
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return (data as CaseWithAppointment[]) || []
    },
    enabled: !!role && !isProtocol(role),
  })
}

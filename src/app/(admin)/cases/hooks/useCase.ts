import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { CaseWithAppointment } from '../types'

export function useCase(id: string | undefined) {
  return useQuery<CaseWithAppointment | null, Error>({
    queryKey: ['case', id],
    queryFn: async () => {
      if (!id) return null

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
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data as CaseWithAppointment | null
    },
    enabled: !!id,
  })
}

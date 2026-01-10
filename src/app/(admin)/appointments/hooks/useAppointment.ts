import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { AppointmentWithClient } from '../types'

export function useAppointment(id: string | undefined) {
  return useQuery<AppointmentWithClient | null, Error>({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
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
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data as AppointmentWithClient | null
    },
    enabled: !!id,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type AppointmentRow = Database['public']['Tables']['appointments']['Row']

// Subset of appointment fields needed for history display
export type ClientAppointment = Pick<
  AppointmentRow,
  'id' | 'subject' | 'scheduled_date' | 'scheduled_time' | 'status' | 'location' | 'duration_minutes'
>

export function useClientAppointments(clientId: string | undefined) {
  return useQuery<ClientAppointment[], Error>({
    queryKey: ['client-appointments', clientId],
    queryFn: async () => {
      if (!clientId) return []

      const { data, error } = await supabase
        .from('appointments')
        .select('id, subject, scheduled_date, scheduled_time, status, location, duration_minutes')
        .eq('client_id', clientId)
        .order('scheduled_date', { ascending: false })
        .order('scheduled_time', { ascending: false })

      if (error) throw new Error(error.message)
      return data || []
    },
    enabled: !!clientId,
  })
}

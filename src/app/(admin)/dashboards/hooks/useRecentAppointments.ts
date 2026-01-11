import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { RecentAppointment } from '../types'

export const useRecentAppointments = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-appointments', limit],
    queryFn: async (): Promise<RecentAppointment[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            organization_name,
            client_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent appointments:', error)
        throw error
      }

      return data as RecentAppointment[]
    },
  })
}

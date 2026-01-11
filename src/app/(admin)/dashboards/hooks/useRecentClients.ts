import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { RecentClient } from '../types'

export const useRecentClients = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-clients', limit],
    queryFn: async (): Promise<RecentClient[]> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent clients:', error)
        throw error
      }

      return data
    },
  })
}

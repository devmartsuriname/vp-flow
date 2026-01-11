import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { RecentCase } from '../types'

export const useRecentCases = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-cases', limit],
    queryFn: async (): Promise<RecentCase[]> => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent cases:', error)
        throw error
      }

      return data
    },
  })
}

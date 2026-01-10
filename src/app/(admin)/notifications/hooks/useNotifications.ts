import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Notification, NotificationFilters } from '../types'

export function useNotifications(filters?: NotificationFilters) {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications', filters?.status || 'all'],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply status filter
      if (filters?.status === 'unread') {
        query = query.eq('is_read', false)
      } else if (filters?.status === 'read') {
        query = query.eq('is_read', true)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

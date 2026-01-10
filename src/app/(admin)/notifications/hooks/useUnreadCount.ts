import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useUnreadCount() {
  return useQuery<number, Error>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (error) {
        throw new Error(error.message)
      }

      return count || 0
    },
  })
}

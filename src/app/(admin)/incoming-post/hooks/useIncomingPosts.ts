import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { IncomingPost } from '../types'
import type { VPFlowRole } from '@/types/auth'

export function useIncomingPosts(role: VPFlowRole | null) {
  return useQuery<IncomingPost[], Error>({
    queryKey: ['incoming-posts', role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incoming_post')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data as unknown as IncomingPost[]) || []
    },
    enabled: !!role,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { IncomingPost } from '../types'
import type { VPFlowRole } from '@/types/auth'

export const INCOMING_POST_PAGE_SIZE = 20

export type IncomingPostsPage = {
  rows: IncomingPost[]
  count: number
}

export function useIncomingPosts(role: VPFlowRole | null, page: number = 1) {
  return useQuery<IncomingPostsPage, Error>({
    queryKey: ['incoming-posts', role, page],
    queryFn: async () => {
      const from = (page - 1) * INCOMING_POST_PAGE_SIZE
      const to = from + INCOMING_POST_PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from('incoming_post')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw new Error(error.message)
      return {
        rows: (data as unknown as IncomingPost[]) || [],
        count: count ?? 0,
      }
    },
    enabled: !!role,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { IncomingPost } from '../types'

export function useIncomingPost(id: string | undefined) {
  return useQuery<IncomingPost | null, Error>({
    queryKey: ['incoming-post', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('incoming_post')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw new Error(error.message)
      return data as unknown as IncomingPost | null
    },
    enabled: !!id,
  })
}

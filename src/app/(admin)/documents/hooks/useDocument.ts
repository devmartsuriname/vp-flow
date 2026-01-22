import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Document } from '../types'

export function useDocument(id: string | undefined) {
  return useQuery<Document | null, Error>({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!id,
  })
}

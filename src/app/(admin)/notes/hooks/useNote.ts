import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteWithLink } from '../types'

export function useNote(id: string | undefined) {
  return useQuery<NoteWithLink | null, Error>({
    queryKey: ['note', id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          note_links (*)
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data as NoteWithLink | null
    },
    enabled: !!id,
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteWithLink } from '../types'

export function useNotes() {
  return useQuery<NoteWithLink[], Error>({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          note_links (*)
        `)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return (data as NoteWithLink[]) || []
    },
  })
}

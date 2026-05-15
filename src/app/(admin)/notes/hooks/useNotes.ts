import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteWithLink } from '../types'

export const NOTES_PAGE_SIZE = 20

export type NotesPage = {
  rows: NoteWithLink[]
  count: number
}

export function useNotes(page: number = 1) {
  return useQuery<NotesPage, Error>({
    queryKey: ['notes', page],
    queryFn: async () => {
      const from = (page - 1) * NOTES_PAGE_SIZE
      const to = from + NOTES_PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from('notes')
        .select(`
          *,
          note_links (*)
        `, { count: 'exact' })
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        rows: (data as NoteWithLink[]) || [],
        count: count ?? 0,
      }
    },
  })
}

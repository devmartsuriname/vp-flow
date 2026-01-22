import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { RecentNote } from '../types'

export const useRecentNotes = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-notes', limit],
    queryFn: async (): Promise<RecentNote[]> => {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          id,
          title,
          updated_at,
          note_links (
            entity_type
          )
        `)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent notes:', error)
        throw error
      }

      // Transform to flatten first note_link if exists
      return (data || []).map(note => ({
        id: note.id,
        title: note.title,
        updated_at: note.updated_at,
        note_link: note.note_links || null,
      }))
    },
  })
}

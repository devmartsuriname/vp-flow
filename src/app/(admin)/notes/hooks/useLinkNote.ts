import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteLinkInsert, NoteEntityType } from '../types'

export function useLinkNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      noteId,
      entityType,
      entityId,
    }: {
      noteId: string
      entityType: NoteEntityType
      entityId: string
    }) => {
      const insertData: NoteLinkInsert = {
        note_id: noteId,
        entity_type: entityType,
        entity_id: entityId,
      }

      const { data, error } = await supabase
        .from('note_links')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['note', variables.noteId] })
      queryClient.invalidateQueries({ queryKey: ['linked-notes'] })
    },
  })
}

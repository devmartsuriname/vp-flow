import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteUpdate, NoteContentFormat } from '../types'

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: { title: string; content: string; contentFormat: NoteContentFormat }
    }) => {
      const updateData: NoteUpdate = {
        title: data.title || null,
        content: data.content,
        content_format: data.contentFormat,
        updated_at: new Date().toISOString(),
      }

      const { data: note, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return note
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] })
    },
  })
}

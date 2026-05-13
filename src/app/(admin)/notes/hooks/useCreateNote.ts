import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteInsert, NoteContentFormat } from '../types'

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      title: string
      content: string
      contentFormat: NoteContentFormat
    }) => {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Not authenticated')
      }

      const insertData: NoteInsert = {
        title: data.title || null,
        content: data.content,
        content_format: data.contentFormat,
        owner_user_id: user.id,
      }

      const { data: note, error } = await supabase
        .from('notes')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

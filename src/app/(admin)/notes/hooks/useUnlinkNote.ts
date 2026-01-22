import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useUnlinkNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteId: string) => {
      // Delete the link (note can only have one link)
      const { error } = await supabase
        .from('note_links')
        .delete()
        .eq('note_id', noteId)

      if (error) {
        throw new Error(error.message)
      }

      return noteId
    },
    onSuccess: (noteId) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['note', noteId] })
      queryClient.invalidateQueries({ queryKey: ['linked-notes'] })
    },
  })
}

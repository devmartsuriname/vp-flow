import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import { handwritingKeys } from './useHandwriting'
import type { HandwritingCanvasData, NoteHandwritingInsert } from '../types'

// Save handwriting (create or update)
export function useSaveHandwriting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      noteId,
      userId,
      canvasData,
      existingRecordId,
    }: {
      noteId: string
      userId: string
      canvasData: HandwritingCanvasData
      existingRecordId?: string
    }) => {
      // 1. Serialize canvas data to JSON
      const jsonContent = JSON.stringify(canvasData)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      
      // 2. Define storage path
      const storagePath = `${userId}/${noteId}/handwriting.json`

      // 3. Upload to storage (upsert)
      const { error: uploadError } = await supabase.storage
        .from('note-handwriting')
        .upload(storagePath, blob, { upsert: true })

      if (uploadError) throw uploadError

      // 4. Create or update database record
      if (existingRecordId) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('note_handwriting')
          .update({
            storage_ref: storagePath,
            stroke_count: canvasData.strokes.length,
          })
          .eq('id', existingRecordId)

        if (updateError) throw updateError
      } else {
        // Create new record
        const insertData: NoteHandwritingInsert = {
          note_id: noteId,
          owner_user_id: userId,
          storage_type: 'vector',
          storage_ref: storagePath,
          stroke_count: canvasData.strokes.length,
        }

        const { error: insertError } = await supabase
          .from('note_handwriting')
          .insert(insertData)

        if (insertError) throw insertError
      }

      return { success: true }
    },
    onSuccess: (_, variables) => {
      toast.success('Handwriting saved')
      queryClient.invalidateQueries({ queryKey: handwritingKeys.byNote(variables.noteId) })
    },
    onError: (error) => {
      console.error('Failed to save handwriting:', error)
      toast.error('Failed to save handwriting')
    },
  })
}

// Delete handwriting (soft delete)
export function useDeleteHandwriting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      recordId,
      noteId,
    }: {
      recordId: string
      noteId: string
    }) => {
      // Soft delete by setting deleted_at
      const { error } = await supabase
        .from('note_handwriting')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', recordId)

      if (error) throw error
      return { success: true, noteId }
    },
    onSuccess: (result) => {
      toast.success('Handwriting deleted')
      queryClient.invalidateQueries({ queryKey: handwritingKeys.byNote(result.noteId) })
    },
    onError: (error) => {
      console.error('Failed to delete handwriting:', error)
      toast.error('Failed to delete handwriting')
    },
  })
}

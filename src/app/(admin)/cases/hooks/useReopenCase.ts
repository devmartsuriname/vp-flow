import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Case } from '../types'

type ReopenCaseParams = {
  id: string
  justification: string // Required - minimum 10 characters
}

export function useReopenCase() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, ReopenCaseParams>({
    mutationFn: async ({ id, justification }: ReopenCaseParams) => {
      // Client-side validation (DB trigger enforces server-side)
      const trimmedJustification = justification?.trim() || ''
      if (trimmedJustification.length < 10) {
        throw new Error('Reopen reason is required (minimum 10 characters)')
      }

      // First verify case is closed
      const { data: existingCase, error: fetchError } = await supabase
        .from('cases')
        .select('status, vp_notes')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (existingCase?.status !== 'closed') {
        throw new Error('Only closed cases can be re-opened')
      }

      // Prepare reopen note for vp_notes (backward compatibility)
      const timestamp = new Date().toISOString()
      const reopenNote = `[Re-opened ${timestamp}]: ${trimmedJustification}`
      const existingNotes = existingCase?.vp_notes || ''
      const appendedNotes = existingNotes 
        ? `${existingNotes}\n\n${reopenNote}` 
        : reopenNote

      // Update case with reopened status and reopen_reason
      // Note: reopened_at and reopened_by are auto-populated by DB trigger
      const { data, error } = await supabase
        .from('cases')
        .update({
          status: 'reopened' as const,
          reopen_reason: trimmedJustification,
          vp_notes: appendedNotes, // Backward compatibility
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
      queryClient.invalidateQueries({ queryKey: ['case', data.id] })
      queryClient.invalidateQueries({ queryKey: ['case-timeline', data.id] })
      toast.success('Case re-opened successfully')
    },
    onError: (error) => {
      toast.error(`Failed to re-open case: ${error.message}`)
    },
  })
}

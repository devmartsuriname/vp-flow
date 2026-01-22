import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Case } from '../types'

type ReopenCaseParams = {
  id: string
  justification?: string
}

export function useReopenCase() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, ReopenCaseParams>({
    mutationFn: async ({ id, justification }: ReopenCaseParams) => {
      // First verify case is closed
      const { data: existingCase, error: fetchError } = await supabase
        .from('cases')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (existingCase?.status !== 'closed') {
        throw new Error('Only closed cases can be re-opened')
      }

      // Prepare update data - transition to reopened status
      const updateData: Record<string, unknown> = {
        status: 'reopened',
      }

      // If justification provided, append to vp_notes
      if (justification?.trim()) {
        const { data: currentCase } = await supabase
          .from('cases')
          .select('vp_notes')
          .eq('id', id)
          .single()

        const timestamp = new Date().toISOString()
        const reopenNote = `[Re-opened ${timestamp}]: ${justification.trim()}`
        const existingNotes = currentCase?.vp_notes || ''
        updateData.vp_notes = existingNotes 
          ? `${existingNotes}\n\n${reopenNote}` 
          : reopenNote
      }

      const { data, error } = await supabase
        .from('cases')
        .update(updateData)
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

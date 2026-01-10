import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Case, CaseStatus } from '../types'

type UpdateStatusParams = {
  id: string
  status: CaseStatus
}

export function useUpdateCaseStatus() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, UpdateStatusParams>({
    mutationFn: async ({ id, status }: UpdateStatusParams) => {
      // First check if case is closed (immutability rule)
      const { data: existingCase, error: fetchError } = await supabase
        .from('cases')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (existingCase?.status === 'closed') {
        throw new Error('Cannot modify a closed case')
      }

      // Build update object
      const updateData: Record<string, unknown> = {
        status,
      }

      // Set opened_at when transitioning to 'open' for first time
      if (status === 'open' && existingCase?.status === 'draft') {
        updateData.opened_at = new Date().toISOString()
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
      toast.success('Case status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update case status: ${error.message}`)
    },
  })
}

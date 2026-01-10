import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Case } from '../types'

type CloseCaseParams = {
  id: string
  resolutionSummary: string
}

export function useCloseCase() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, CloseCaseParams>({
    mutationFn: async ({ id, resolutionSummary }: CloseCaseParams) => {
      // Get current user for closed_by
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to close a case')
      }

      // First check if case is already closed (immutability rule)
      const { data: existingCase, error: fetchError } = await supabase
        .from('cases')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (existingCase?.status === 'closed') {
        throw new Error('Case is already closed')
      }

      const updateData = {
        status: 'closed' as const,
        resolution_summary: resolutionSummary,
        closed_at: new Date().toISOString(),
        closed_by: user.id,
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
      toast.success('Case closed successfully')
    },
    onError: (error) => {
      toast.error(`Failed to close case: ${error.message}`)
    },
  })
}

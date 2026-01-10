import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { CaseFormData, Case } from '../types'

type UpdateCaseParams = {
  id: string
  formData: CaseFormData
}

export function useUpdateCase() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, UpdateCaseParams>({
    mutationFn: async ({ id, formData }: UpdateCaseParams) => {
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

      const updateData = {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        deadline: formData.deadline || null,
        vp_notes: formData.vp_notes || null,
        // Note: appointment_id cannot be changed after creation
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
      toast.success('Case updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update case: ${error.message}`)
    },
  })
}

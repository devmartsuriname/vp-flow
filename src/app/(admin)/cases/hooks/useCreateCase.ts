import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { CaseFormData, Case } from '../types'

// Generate case number with format: CASE-YYYY-XXXX
function generateCaseNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000) // 4 digit random
  return `CASE-${year}-${random}`
}

export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation<Case, Error, CaseFormData>({
    mutationFn: async (formData: CaseFormData) => {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to create a case')
      }

      const insertData = {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        deadline: formData.deadline || null,
        appointment_id: formData.appointment_id || null,
        vp_notes: formData.vp_notes || null,
        case_number: generateCaseNumber(),
        status: 'draft' as const,
        created_by: user.id,
      }

      const { data, error } = await supabase
        .from('cases')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
      toast.success('Case created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create case: ${error.message}`)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Document, DocumentStatus } from '../types'

type ChangeStatusInput = {
  id: string
  status: DocumentStatus
}

export function useChangeDocumentStatus() {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, ChangeStatusInput>({
    mutationFn: async ({ id, status }: ChangeStatusInput) => {
      const { data, error } = await supabase
        .from('documents')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', data.id] })
      queryClient.invalidateQueries({ queryKey: ['document-versions'] })
      toast.success('Document status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to change status: ${error.message}`)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Document } from '../types'

export function useDeactivateDocument() {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, string>({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('documents')
        .update({ is_active: false })
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
      toast.success('Document deactivated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to deactivate document: ${error.message}`)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Appointment } from '../types'

export function useCompleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation<Appointment, Error, string>({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'completed' as const,
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
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
      toast.success('Appointment marked as completed')
    },
    onError: (error) => {
      toast.error(`Failed to complete appointment: ${error.message}`)
    },
  })
}

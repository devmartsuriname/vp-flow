import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Appointment } from '../types'

type RejectParams = {
  id: string
  reason: string
}

export function useRejectAppointment() {
  const queryClient = useQueryClient()

  return useMutation<Appointment, Error, RejectParams>({
    mutationFn: async ({ id, reason }: RejectParams) => {
      // Get current user for rejected_by
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'rejected' as const,
          rejected_by: user?.id || null,
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
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
      toast.success('Appointment rejected')
    },
    onError: (error) => {
      toast.error(`Failed to reject appointment: ${error.message}`)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Appointment } from '../types'

export function useApproveAppointment() {
  const queryClient = useQueryClient()

  return useMutation<Appointment, Error, string>({
    mutationFn: async (id: string) => {
      // Get current user for approved_by
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'approved' as const,
          approved_by: user?.id || null,
          approved_at: new Date().toISOString(),
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
      toast.success('Appointment approved successfully')
    },
    onError: (error) => {
      toast.error(`Failed to approve appointment: ${error.message}`)
    },
  })
}

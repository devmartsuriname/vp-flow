import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { AppointmentFormData, Appointment } from '../types'

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation<Appointment, Error, AppointmentFormData>({
    mutationFn: async (formData: AppointmentFormData) => {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser()

      const insertData = {
        client_id: formData.client_id,
        subject: formData.subject,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        duration_minutes: formData.duration_minutes,
        location: formData.location || null,
        description: formData.description || null,
        visibility: formData.visibility,
        vp_notes: formData.vp_notes || null,
        status: 'draft' as const,
        created_by: user?.id || null,
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create appointment: ${error.message}`)
    },
  })
}

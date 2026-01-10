import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { AppointmentFormData, Appointment } from '../types'

type UpdateAppointmentParams = {
  id: string
  formData: AppointmentFormData
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation<Appointment, Error, UpdateAppointmentParams>({
    mutationFn: async ({ id, formData }: UpdateAppointmentParams) => {
      const updateData = {
        client_id: formData.client_id,
        subject: formData.subject,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        duration_minutes: formData.duration_minutes,
        location: formData.location || null,
        description: formData.description || null,
        visibility: formData.visibility,
        vp_notes: formData.vp_notes || null,
      }

      const { data, error } = await supabase
        .from('appointments')
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
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
      toast.success('Appointment updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update appointment: ${error.message}`)
    },
  })
}

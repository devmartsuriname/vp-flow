import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { IncomingPost, IncomingPostStatus } from '../types'

type StatusUpdateParams = {
  id: string
  status: IncomingPostStatus
  advice_request?: string
  advice_response?: string
  forwarding_destination?: string
  rejection_reason?: string
  linked_appointment_id?: string
}

export function useUpdateIncomingPostStatus() {
  const queryClient = useQueryClient()

  return useMutation<IncomingPost, Error, StatusUpdateParams>({
    mutationFn: async ({ id, status, ...extras }) => {
      const updateData: Record<string, unknown> = { status }

      if (extras.advice_request) updateData.advice_request = extras.advice_request
      if (extras.advice_response) updateData.advice_response = extras.advice_response
      if (extras.forwarding_destination) updateData.forwarding_destination = extras.forwarding_destination
      if (extras.rejection_reason) updateData.rejection_reason = extras.rejection_reason
      if (extras.linked_appointment_id) updateData.linked_appointment_id = extras.linked_appointment_id

      const { data, error } = await supabase
        .from('incoming_post')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as unknown as IncomingPost
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incoming-posts'] })
      queryClient.invalidateQueries({ queryKey: ['incoming-post', data.id] })
      toast.success('Status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { IncomingPostFormData, IncomingPost } from '../types'

export function useCreateIncomingPost() {
  const queryClient = useQueryClient()

  return useMutation<IncomingPost, Error, IncomingPostFormData>({
    mutationFn: async (formData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in')

      const { data, error } = await supabase
        .from('incoming_post')
        .insert({
          subject: formData.subject,
          sender_name: formData.sender_name,
          sender_organization: formData.sender_organization || null,
          received_date: formData.received_date,
          category: formData.category,
          urgency: formData.urgency,
          description: formData.description || null,
          created_by: user.id,
          reference_number: 'TEMP', // Will be overwritten by trigger
        } as any)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as unknown as IncomingPost
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming-posts'] })
      toast.success('Incoming post registered successfully')
    },
    onError: (error) => {
      toast.error(`Failed to register post: ${error.message}`)
    },
  })
}

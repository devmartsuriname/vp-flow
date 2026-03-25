import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { IncomingPost } from '../types'

type UpdateParams = {
  id: string
  updates: Partial<Pick<IncomingPost, 'subject' | 'sender_name' | 'sender_organization' | 'description' | 'category' | 'urgency'>>
}

export function useUpdateIncomingPost() {
  const queryClient = useQueryClient()

  return useMutation<IncomingPost, Error, UpdateParams>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('incoming_post')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as unknown as IncomingPost
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incoming-posts'] })
      queryClient.invalidateQueries({ queryKey: ['incoming-post', data.id] })
      toast.success('Post updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`)
    },
  })
}

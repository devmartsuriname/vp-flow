import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { ClientFormData, Client } from '../types'

type UpdateClientParams = {
  id: string
  formData: ClientFormData
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation<Client, Error, UpdateClientParams>({
    mutationFn: async ({ id, formData }: UpdateClientParams) => {
      const updateData = {
        client_type: formData.client_type,
        first_name: formData.client_type === 'person' ? formData.first_name : null,
        last_name: formData.client_type === 'person' ? formData.last_name : null,
        organization_name: formData.client_type === 'organization' ? formData.organization_name : null,
        contact_person: formData.contact_person || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address_line1: formData.address_line1 || null,
        address_line2: formData.address_line2 || null,
        city: formData.city || null,
        district: formData.district || null,
        notes: formData.notes || null,
      }

      const { data, error } = await supabase
        .from('clients')
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
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', data.id] })
      toast.success('Client updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update client: ${error.message}`)
    },
  })
}

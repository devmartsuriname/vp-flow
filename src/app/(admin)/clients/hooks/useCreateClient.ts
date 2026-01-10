import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { ClientFormData, Client } from '../types'

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation<Client, Error, ClientFormData>({
    mutationFn: async (formData: ClientFormData) => {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser()

      const insertData = {
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
        created_by: user?.id || null,
      }

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create client: ${error.message}`)
    },
  })
}

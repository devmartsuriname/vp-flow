import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Document, DocumentUploadData } from '../types'

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, DocumentUploadData>({
    mutationFn: async ({ file, title, description, entity_type, entity_id }: DocumentUploadData) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Generate unique file path
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${entity_type}/${entity_id}/${timestamp}_${safeName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          title: title || file.name,
          description: description || null,
          entity_type,
          entity_id,
          uploaded_by: user.id,
        })
        .select()
        .single()

      if (error) {
        // Clean up uploaded file if record creation fails
        await supabase.storage.from('documents').remove([filePath])
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['documents', data.entity_type, data.entity_id] })
      toast.success('Document uploaded successfully')
    },
    onError: (error) => {
      toast.error(`Failed to upload document: ${error.message}`)
    },
  })
}

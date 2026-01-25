import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-toastify'
import type { Document, UploadVersionData } from '../types'

export function useUploadNewVersion() {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, UploadVersionData>({
    mutationFn: async ({ parentDocument, file, title, description }: UploadVersionData) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Calculate next version number
      const nextVersion = (parentDocument.version_number ?? 1) + 1

      // Upload file to storage
      const filePath = `${parentDocument.entity_type}/${parentDocument.entity_id}/v${nextVersion}_${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Create new document record linked to parent
      const { data, error } = await supabase
        .from('documents')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          title: title || file.name,
          description,
          entity_type: parentDocument.entity_type,
          entity_id: parentDocument.entity_id,
          uploaded_by: user.id,
          version_number: nextVersion,
          parent_document_id: parentDocument.id,
          is_current_version: true,
          status: 'draft', // New versions start as draft
        })
        .select()
        .single()

      if (error) {
        // Rollback: delete uploaded file
        await supabase.storage.from('documents').remove([filePath])
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document-versions'] })
      toast.success('New version uploaded successfully')
    },
    onError: (error) => {
      toast.error(`Failed to upload version: ${error.message}`)
    },
  })
}

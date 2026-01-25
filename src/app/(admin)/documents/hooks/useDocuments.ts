import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Document, DocumentEntityType, DocumentStatus } from '../types'

type UseDocumentsOptions = {
  entityType?: DocumentEntityType | ''
  entityId?: string
  activeOnly?: boolean
  currentVersionOnly?: boolean
  status?: DocumentStatus | ''
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { 
    entityType, 
    entityId, 
    activeOnly = true, 
    currentVersionOnly = true,
    status 
  } = options

  return useQuery<Document[], Error>({
    queryKey: ['documents', entityType, entityId, activeOnly, currentVersionOnly, status],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      // Filter by entity type if specified
      if (entityType) {
        query = query.eq('entity_type', entityType)
      }

      // Filter by entity ID if specified
      if (entityId) {
        query = query.eq('entity_id', entityId)
      }

      // Filter active only
      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      // Filter current versions only (default: true)
      if (currentVersionOnly) {
        query = query.eq('is_current_version', true)
      }

      // Filter by status if specified
      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

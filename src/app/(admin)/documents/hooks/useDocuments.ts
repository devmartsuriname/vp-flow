import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Document, DocumentEntityType, DocumentStatus } from '../types'

export const DOCUMENTS_PAGE_SIZE = 20

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
    status,
  } = options

  return useQuery<Document[], Error>({
    queryKey: ['documents', entityType, entityId, activeOnly, currentVersionOnly, status],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (entityType) query = query.eq('entity_type', entityType)
      if (entityId) query = query.eq('entity_id', entityId)
      if (activeOnly) query = query.eq('is_active', true)
      if (currentVersionOnly) query = query.eq('is_current_version', true)
      if (status) query = query.eq('status', status)

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

export type DocumentsPage = {
  rows: Document[]
  count: number
}

export function useDocumentsPaginated(options: UseDocumentsOptions = {}, page: number = 1) {
  const {
    entityType,
    entityId,
    activeOnly = true,
    currentVersionOnly = true,
    status,
  } = options

  return useQuery<DocumentsPage, Error>({
    queryKey: ['documents-paginated', entityType, entityId, activeOnly, currentVersionOnly, status, page],
    queryFn: async () => {
      const from = (page - 1) * DOCUMENTS_PAGE_SIZE
      const to = from + DOCUMENTS_PAGE_SIZE - 1

      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .order('uploaded_at', { ascending: false })

      if (entityType) query = query.eq('entity_type', entityType)
      if (entityId) query = query.eq('entity_id', entityId)
      if (activeOnly) query = query.eq('is_active', true)
      if (currentVersionOnly) query = query.eq('is_current_version', true)
      if (status) query = query.eq('status', status)

      const { data, error, count } = await query.range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        rows: data || [],
        count: count ?? 0,
      }
    },
  })
}

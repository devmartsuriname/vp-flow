import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Document } from '../types'

/**
 * Fetches the complete version history for a document.
 * Traverses the version chain to find all related documents.
 */
export function useDocumentVersionHistory(documentId: string | undefined) {
  return useQuery<Document[], Error>({
    queryKey: ['document-versions', documentId],
    queryFn: async () => {
      if (!documentId) return []

      // First, get the target document
      const { data: targetDoc, error: targetError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (targetError || !targetDoc) {
        throw new Error(targetError?.message || 'Document not found')
      }

      // Find the root document by traversing up the parent chain
      let rootId = documentId
      let currentParentId = targetDoc.parent_document_id

      while (currentParentId) {
        const { data: parentDoc } = await supabase
          .from('documents')
          .select('id, parent_document_id')
          .eq('id', currentParentId)
          .single()

        if (parentDoc) {
          rootId = parentDoc.id
          currentParentId = parentDoc.parent_document_id
        } else {
          break
        }
      }

      // Now fetch all documents in the version chain
      // This includes the root and all descendants
      const allVersions: Document[] = []
      const queue: string[] = [rootId]
      const processed = new Set<string>()

      while (queue.length > 0) {
        const currentId = queue.shift()!
        if (processed.has(currentId)) continue
        processed.add(currentId)

        // Fetch the current document
        const { data: doc } = await supabase
          .from('documents')
          .select('*')
          .eq('id', currentId)
          .single()

        if (doc) {
          allVersions.push(doc)

          // Find children of this document
          const { data: children } = await supabase
            .from('documents')
            .select('id')
            .eq('parent_document_id', currentId)

          if (children) {
            children.forEach((child) => {
              if (!processed.has(child.id)) {
                queue.push(child.id)
              }
            })
          }
        }
      }

      // Sort by version number descending (newest first)
      return allVersions.sort((a, b) => (b.version_number ?? 1) - (a.version_number ?? 1))
    },
    enabled: !!documentId,
  })
}

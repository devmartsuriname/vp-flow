import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Document } from '../types'

type AuditAction = 'document_viewed' | 'document_downloaded'

type AuditEventParams = {
  document: Document
  action: AuditAction
}

/**
 * Hook for logging document view/download audit events.
 * These are frontend-triggered events since read operations
 * don't modify data and cannot be captured by DB triggers.
 */
export function useDocumentAudit() {
  return useMutation<void, Error, AuditEventParams>({
    mutationFn: async ({ document, action }: AuditEventParams) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Insert audit event
      const { error } = await supabase
        .from('audit_events')
        .insert({
          entity_type: 'documents',
          entity_id: document.id,
          action,
          performed_by: user.id,
          old_values: null,
          new_values: {
            file_name: document.file_name,
            title: document.title,
            entity_type: document.entity_type,
            entity_id: document.entity_id,
          },
        })

      if (error) {
        // Log error but don't throw - audit should not block user action
        console.error('Failed to log audit event:', error.message)
      }
    },
    // Silent operation - no toast notifications for audit logging
    onError: (error) => {
      console.error('Audit logging failed:', error.message)
    },
  })
}

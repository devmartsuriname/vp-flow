/**
 * Hooks for VP-only email_settings (single-row config).
 * TC-006 Phase 1A.2 — Email Notifications.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export type EmailSettings = {
  id: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  from_address: string
  from_name: string
  enabled: boolean
}

const EMAIL_SETTINGS_QUERY_KEY = ['email-settings'] as const

export function useGetEmailSettings() {
  return useQuery({
    queryKey: EMAIL_SETTINGS_QUERY_KEY,
    queryFn: async (): Promise<EmailSettings | null> => {
      const { data, error } = await supabase
        .from('email_settings')
        .select('id, smtp_host, smtp_port, smtp_username, smtp_password, from_address, from_name, enabled')
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching email settings:', error)
        throw error
      }
      return (data as EmailSettings) ?? null
    },
  })
}

export type EmailSettingsUpdate = Omit<EmailSettings, 'id'>

export function useUpsertEmailSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: EmailSettingsUpdate }) => {
      const { error } = await supabase
        .from('email_settings')
        .update(values)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_SETTINGS_QUERY_KEY })
    },
  })
}

export function useEmailSettings() {
  return {
    query: useGetEmailSettings(),
    upsert: useUpsertEmailSettings(),
  }
}

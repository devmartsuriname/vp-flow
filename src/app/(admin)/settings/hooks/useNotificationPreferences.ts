/**
 * Hooks for per-user notification_preferences (push + email toggles).
 * TC-011 Phase 1B — Notification Preferences.
 *
 * Opt-out model: absence of row = both channels enabled.
 * Owner-only RLS — each user reads/writes their own row.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/context/useAuthContext'

export type NotificationPreferences = {
  user_id: string
  push_enabled: boolean
  email_enabled: boolean
}

const NOTIFICATION_PREFERENCES_QUERY_KEY = ['notification-preferences'] as const

export function useGetNotificationPreferences() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: [...NOTIFICATION_PREFERENCES_QUERY_KEY, user?.id],
    queryFn: async (): Promise<NotificationPreferences | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('user_id, push_enabled, email_enabled')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching notification preferences:', error)
        throw error
      }
      return (data as NotificationPreferences) ?? null
    },
    enabled: !!user?.id,
  })
}

export type NotificationPreferencesUpdate = {
  push_enabled: boolean
  email_enabled: boolean
}

export function useUpsertNotificationPreferences() {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: async (values: NotificationPreferencesUpdate) => {
      if (!user?.id) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: user.id,
            push_enabled: values.push_enabled,
            email_enabled: values.email_enabled,
          },
          { onConflict: 'user_id' },
        )

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY })
    },
  })
}

export function useNotificationPreferences() {
  return {
    query: useGetNotificationPreferences(),
    upsert: useUpsertNotificationPreferences(),
  }
}

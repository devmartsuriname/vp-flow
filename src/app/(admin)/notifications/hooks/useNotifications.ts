import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Notification, NotificationFilters } from '../types'

export const NOTIFICATIONS_PAGE_SIZE = 20

type UseNotificationsOptions = NotificationFilters & {
  /**
   * When set, applies `.limit(limit)` at query level and disables pagination.
   * Used by the topbar notifications dropdown to fetch only the most recent N rows.
   */
  limit?: number
}

export function useNotifications(filters?: UseNotificationsOptions) {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications', filters?.status || 'all', filters?.limit ?? null],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply status filter
      if (filters?.status === 'unread') {
        query = query.eq('is_read', false)
      } else if (filters?.status === 'read') {
        query = query.eq('is_read', true)
      }

      if (filters?.limit !== undefined) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

export type NotificationsPage = {
  rows: Notification[]
  count: number
}

export function useNotificationsPaginated(filters: NotificationFilters | undefined, page: number = 1) {
  return useQuery<NotificationsPage, Error>({
    queryKey: ['notifications-paginated', filters?.status || 'all', page],
    queryFn: async () => {
      const from = (page - 1) * NOTIFICATIONS_PAGE_SIZE
      const to = from + NOTIFICATIONS_PAGE_SIZE - 1

      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (filters?.status === 'unread') {
        query = query.eq('is_read', false)
      } else if (filters?.status === 'read') {
        query = query.eq('is_read', true)
      }

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

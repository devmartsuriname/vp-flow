import type { Database } from '@/integrations/supabase/types'

export type Notification = Database['public']['Tables']['notifications']['Row']

export type NotificationFilterStatus = 'all' | 'unread' | 'read'

export interface NotificationFilters {
  status: NotificationFilterStatus
}

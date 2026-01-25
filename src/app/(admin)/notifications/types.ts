import type { Database } from '@/integrations/supabase/types'

export type Notification = Database['public']['Tables']['notifications']['Row']

export type NotificationCategory = 'case' | 'appointment' | 'document' | 'system'

export type NotificationFilterStatus = 'all' | 'unread' | 'read'

export interface NotificationFilters {
  status: NotificationFilterStatus
  category?: NotificationCategory | 'all'
}

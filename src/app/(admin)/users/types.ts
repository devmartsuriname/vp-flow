import type { Database } from '@/integrations/supabase/types'

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type AppRole = Database['public']['Enums']['app_role']

/**
 * Combined user profile with role information for display
 */
export interface UserWithRole extends UserProfile {
  role: AppRole | null
}

/**
 * Filters for user list
 */
export interface UserFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
}

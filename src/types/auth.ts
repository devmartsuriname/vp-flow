import type { User, Session } from '@supabase/supabase-js'

// VP-Flow role types (from database enum)
export type VPFlowRole = 'vp' | 'secretary' | 'protocol'

// User type for VP-Flow (Supabase-based)
export type UserType = {
  id: string
  email: string
  fullName?: string
  role?: VPFlowRole
}

// Auth session type
export type AuthSession = {
  user: User | null
  session: Session | null
}

// User role record from database
export type UserRoleRecord = {
  id: string
  user_id: string
  role: VPFlowRole
  created_at: string
  created_by: string | null
}

// User profile record from database
export type UserProfileRecord = {
  id: string
  full_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
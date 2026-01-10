import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { UserWithRole, UserFilters, AppRole } from '../types'

interface UseUsersOptions {
  filters: UserFilters
  currentUserId: string | null
  currentUserRole: AppRole | null
}

/**
 * Fetch users with role information
 * - VP: sees all profiles + all roles
 * - Secretary: sees all profiles but only own role
 * - Protocol: should not access this (handled at page level)
 */
export const useUsers = ({ filters, currentUserId, currentUserRole }: UseUsersOptions) => {
  return useQuery({
    queryKey: ['users', filters, currentUserId, currentUserRole],
    queryFn: async (): Promise<UserWithRole[]> => {
      // Fetch all user profiles
      let profilesQuery = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply status filter
      if (filters.status === 'active') {
        profilesQuery = profilesQuery.eq('is_active', true)
      } else if (filters.status === 'inactive') {
        profilesQuery = profilesQuery.eq('is_active', false)
      }

      // Apply search filter
      if (filters.search.trim()) {
        profilesQuery = profilesQuery.ilike('full_name', `%${filters.search.trim()}%`)
      }

      const { data: profiles, error: profilesError } = await profilesQuery

      if (profilesError) {
        throw new Error(`Failed to fetch users: ${profilesError.message}`)
      }

      if (!profiles || profiles.length === 0) {
        return []
      }

      // Fetch roles based on current user's role
      let rolesMap: Record<string, AppRole> = {}

      if (currentUserRole === 'vp') {
        // VP can see all roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')

        if (!rolesError && roles) {
          rolesMap = roles.reduce((acc, r) => {
            acc[r.user_id] = r.role
            return acc
          }, {} as Record<string, AppRole>)
        }
      } else if (currentUserRole === 'secretary' && currentUserId) {
        // Secretary can only see own role (RLS restriction)
        const { data: ownRole, error: ownRoleError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('user_id', currentUserId)
          .maybeSingle()

        if (!ownRoleError && ownRole) {
          rolesMap[ownRole.user_id] = ownRole.role
        }
      }
      // Protocol should not reach here (blocked at page level)

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = profiles.map((profile) => ({
        ...profile,
        role: rolesMap[profile.id] || null,
      }))

      return usersWithRoles
    },
    enabled: !!currentUserId && (currentUserRole === 'vp' || currentUserRole === 'secretary'),
  })
}

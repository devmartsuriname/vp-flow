/**
 * Hook to fetch current user's profile data for Settings page
 */

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/context/useAuthContext'
import type { UserProfileData } from '../types'

export function useUserProfile() {
  const { user, role } = useAuthContext()

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfileData | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, is_active, created_at')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user profile:', error)
        throw error
      }

      if (!data) return null

      return {
        id: data.id,
        full_name: data.full_name,
        email: user.email || '',
        role: role,
        is_active: data.is_active,
        created_at: data.created_at,
      }
    },
    enabled: !!user?.id,
  })
}

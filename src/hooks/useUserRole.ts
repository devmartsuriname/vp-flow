import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { VPFlowRole } from '@/types/auth'

type UseUserRoleResult = {
  role: VPFlowRole | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage the current user's role from the user_roles table.
 * 
 * Per VP-Flow security requirements:
 * - Roles are stored in a SEPARATE table (user_roles), not on profiles
 * - This prevents privilege escalation attacks
 * - Role is fetched fresh from database, not cached in localStorage
 */
export function useUserRole(): UseUserRoleResult {
  const [role, setRole] = useState<VPFlowRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRole = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw userError
      }

      if (!user) {
        setRole(null)
        return
      }

      // Fetch role from user_roles table
      const { data, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (roleError) {
        throw roleError
      }

      setRole(data?.role as VPFlowRole | null)
    } catch (err) {
      console.error('Error fetching user role:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch role'))
      setRole(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRole()

    // Subscribe to auth changes to refetch role
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchRole()
      } else if (event === 'SIGNED_OUT') {
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchRole])

  return {
    role,
    isLoading,
    error,
    refetch: fetchRole,
  }
}

/**
 * Helper functions for role checks.
 * These mirror the database functions for client-side convenience.
 */
export function isVP(role: VPFlowRole | null): boolean {
  return role === 'vp'
}

export function isSecretary(role: VPFlowRole | null): boolean {
  return role === 'secretary'
}

export function isProtocol(role: VPFlowRole | null): boolean {
  return role === 'protocol'
}

export function isVPOrSecretary(role: VPFlowRole | null): boolean {
  return role === 'vp' || role === 'secretary'
}
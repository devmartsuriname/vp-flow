import type { User, Session } from '@supabase/supabase-js'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChildrenType } from '@/types/component-props'
import type { VPFlowRole } from '@/types/auth'
import { supabase } from '@/integrations/supabase/client'

export type AuthContextType = {
  user: User | null
  session: Session | null
  role: VPFlowRole | null
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: ChildrenType) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<VPFlowRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user role from user_roles table
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user role:', error)
        return null
      }

      return data?.role as VPFlowRole | null
    } catch (err) {
      console.error('Error fetching user role:', err)
      return null
    }
  }, [])

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        // Defer role fetch to prevent deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRole(currentSession.user.id).then(setRole)
          }, 0)
        } else {
          setRole(null)
        }
        
        setIsLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession)
      setUser(existingSession?.user ?? null)
      
      if (existingSession?.user) {
        fetchUserRole(existingSession.user.id).then(setRole)
      }
      
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchUserRole])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
    }
    setUser(null)
    setSession(null)
    setRole(null)
    navigate('/auth/sign-in')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAuthenticated: !!session,
        isLoading,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
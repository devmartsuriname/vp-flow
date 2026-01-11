import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useUnreadCount } from '@/app/(admin)/notifications/hooks'
import type { DashboardStats, AppRole } from '../types'

export const useDashboardStats = (role: AppRole | null) => {
  const { data: unreadCount = 0 } = useUnreadCount()

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', role],
    queryFn: async (): Promise<Omit<DashboardStats, 'unreadNotifications'>> => {
      // Fetch total clients count
      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      if (clientsError) {
        console.error('Error fetching clients count:', clientsError)
      }

      // Fetch open appointments count (approved status)
      const { count: appointmentsCount, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      if (appointmentsError) {
        console.error('Error fetching appointments count:', appointmentsError)
      }

      // Fetch active cases count (not closed) - only for VP
      let casesCount = 0
      if (role === 'vp') {
        const { count, error: casesError } = await supabase
          .from('cases')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'closed')

        if (casesError) {
          console.error('Error fetching cases count:', casesError)
        }
        casesCount = count ?? 0
      }

      return {
        totalClients: clientsCount ?? 0,
        openAppointments: appointmentsCount ?? 0,
        activeCases: casesCount,
      }
    },
    enabled: !!role && role !== 'protocol',
  })

  return {
    stats: {
      totalClients: stats?.totalClients ?? 0,
      openAppointments: stats?.openAppointments ?? 0,
      activeCases: stats?.activeCases ?? 0,
      unreadNotifications: unreadCount,
    },
    isLoading,
    error,
  }
}

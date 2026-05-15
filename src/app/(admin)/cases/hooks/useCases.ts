import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { CaseWithAppointment } from '../types'
import type { VPFlowRole } from '@/types/auth'
import { isProtocol } from '@/hooks/useUserRole'

export const CASES_PAGE_SIZE = 20

export type CasesPage = {
  rows: CaseWithAppointment[]
  count: number
}

export function useCases(role: VPFlowRole | null, page: number = 1) {

  return useQuery<CasesPage, Error>({
    queryKey: ['cases', role, page],
    queryFn: async () => {
      // Protocol has NO access to cases (RLS blocks, but UI also filters)
      if (isProtocol(role)) {
        return { rows: [], count: 0 }
      }

      const from = (page - 1) * CASES_PAGE_SIZE
      const to = from + CASES_PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from('cases')
        .select(`
          *,
          appointments (
            id,
            subject,
            scheduled_date,
            scheduled_time,
            clients (
              id,
              first_name,
              last_name,
              organization_name,
              client_type
            )
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        rows: (data as CaseWithAppointment[]) || [],
        count: count ?? 0,
      }
    },
    enabled: !!role && !isProtocol(role),
  })
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Client } from '../types'

export const CLIENTS_PAGE_SIZE = 20

export function useClients() {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

export type ClientsPage = {
  rows: Client[]
  count: number
}

export function useClientsPaginated(page: number = 1) {
  return useQuery<ClientsPage, Error>({
    queryKey: ['clients-paginated', page],
    queryFn: async () => {
      const from = (page - 1) * CLIENTS_PAGE_SIZE
      const to = from + CLIENTS_PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        rows: data || [],
        count: count ?? 0,
      }
    },
  })
}

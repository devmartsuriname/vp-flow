import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/context/useAuthContext'

export interface SearchResult {
  id: string
  type: 'guest' | 'appointment' | 'case'
  title: string
  subtitle: string
  link: string
}

export interface GlobalSearchResults {
  guests: SearchResult[]
  appointments: SearchResult[]
  cases: SearchResult[]
}

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 3
const MAX_RESULTS_PER_CATEGORY = 5

/**
 * Global Search Hook
 * Performs parallel RLS-enforced queries across clients, appointments, and cases.
 * Protocol role is restricted from case results.
 */
export const useGlobalSearch = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { role } = useAuthContext()

  // Debounce the search query
  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setDebouncedQuery('')
      return
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  const searchEnabled = debouncedQuery.length >= MIN_QUERY_LENGTH

  // Search clients (guests)
  const guestsQuery = useQuery({
    queryKey: ['global-search', 'guests', debouncedQuery],
    queryFn: async () => {
      const searchPattern = `%${debouncedQuery}%`
      
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, organization_name, email, client_type')
        .or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},organization_name.ilike.${searchPattern},email.ilike.${searchPattern}`)
        .limit(MAX_RESULTS_PER_CATEGORY)

      if (error) throw error

      return (data || []).map((client): SearchResult => ({
        id: client.id,
        type: 'guest',
        title: client.client_type === 'organization' 
          ? client.organization_name || 'Unknown Organization'
          : `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown',
        subtitle: client.email || 'No email',
        link: `/guests/${client.id}`
      }))
    },
    enabled: searchEnabled,
    staleTime: 30000,
  })

  // Search appointments
  const appointmentsQuery = useQuery({
    queryKey: ['global-search', 'appointments', debouncedQuery],
    queryFn: async () => {
      const searchPattern = `%${debouncedQuery}%`
      
      const { data, error } = await supabase
        .from('appointments')
        .select('id, subject, location, scheduled_date, scheduled_time, status')
        .or(`subject.ilike.${searchPattern},location.ilike.${searchPattern}`)
        .limit(MAX_RESULTS_PER_CATEGORY)

      if (error) throw error

      return (data || []).map((appt): SearchResult => ({
        id: appt.id,
        type: 'appointment',
        title: appt.subject,
        subtitle: `${appt.scheduled_date} at ${appt.scheduled_time} • ${appt.status}`,
        link: `/appointments/${appt.id}`
      }))
    },
    enabled: searchEnabled,
    staleTime: 30000,
  })

  // Search cases (VP and Secretary only - Protocol excluded via RLS)
  const casesQuery = useQuery({
    queryKey: ['global-search', 'cases', debouncedQuery, role],
    queryFn: async () => {
      // Protocol role cannot access cases - return empty
      if (role === 'protocol') {
        return []
      }

      const searchPattern = `%${debouncedQuery}%`
      
      const { data, error } = await supabase
        .from('cases')
        .select('id, case_number, title, description, status, priority')
        .or(`case_number.ilike.${searchPattern},title.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(MAX_RESULTS_PER_CATEGORY)

      if (error) throw error

      return (data || []).map((caseItem): SearchResult => ({
        id: caseItem.id,
        type: 'case',
        title: `${caseItem.case_number}: ${caseItem.title}`,
        subtitle: `${caseItem.status} • ${caseItem.priority} priority`,
        link: `/cases/${caseItem.id}`
      }))
    },
    enabled: searchEnabled && role !== 'protocol',
    staleTime: 30000,
  })

  const results: GlobalSearchResults = useMemo(() => ({
    guests: guestsQuery.data || [],
    appointments: appointmentsQuery.data || [],
    cases: casesQuery.data || []
  }), [guestsQuery.data, appointmentsQuery.data, casesQuery.data])

  const totalResults = results.guests.length + results.appointments.length + results.cases.length
  
  const isLoading = searchEnabled && (
    guestsQuery.isLoading || 
    appointmentsQuery.isLoading || 
    (role !== 'protocol' && casesQuery.isLoading)
  )

  const hasError = guestsQuery.isError || appointmentsQuery.isError || casesQuery.isError

  return {
    results,
    totalResults,
    isLoading,
    hasError,
    searchEnabled,
    query: debouncedQuery
  }
}

export default useGlobalSearch

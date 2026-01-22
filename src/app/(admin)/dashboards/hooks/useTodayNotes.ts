import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import type { TodayNote } from '../types'

export const useTodayNotes = (limit: number = 5) => {
  return useQuery({
    queryKey: ['today-notes', limit],
    queryFn: async (): Promise<TodayNote[]> => {
      const today = format(new Date(), 'yyyy-MM-dd')

      // Get notes linked to appointments scheduled for today
      const { data, error } = await supabase
        .from('note_links')
        .select(`
          entity_id,
          notes!inner (
            id,
            title,
            updated_at,
            deleted_at
          )
        `)
        .eq('entity_type', 'appointment')
        .is('notes.deleted_at', null)
        .limit(limit * 2) // Fetch extra to filter by today's appointments

      if (error) {
        console.error('Error fetching today notes:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return []
      }

      // Get today's appointment IDs
      const appointmentIds = [...new Set(data.map(nl => nl.entity_id))]
      
      const { data: todayAppointments, error: apptError } = await supabase
        .from('appointments')
        .select('id, subject')
        .in('id', appointmentIds)
        .eq('scheduled_date', today)

      if (apptError) {
        console.error('Error fetching today appointments:', apptError)
        throw apptError
      }

      const todayApptMap = new Map(
        (todayAppointments || []).map(a => [a.id, a.subject])
      )

      // Filter and transform
      const result: TodayNote[] = []
      for (const item of data) {
        if (todayApptMap.has(item.entity_id) && item.notes) {
          result.push({
            id: item.notes.id,
            title: item.notes.title,
            updated_at: item.notes.updated_at,
            note_link: { entity_type: 'appointment' },
            appointment_subject: todayApptMap.get(item.entity_id) || undefined,
          })
        }
        if (result.length >= limit) break
      }

      return result
    },
  })
}

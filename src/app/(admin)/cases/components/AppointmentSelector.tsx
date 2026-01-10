import { Form, Spinner } from 'react-bootstrap'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  clients: {
    id: string
    first_name: string | null
    last_name: string | null
    organization_name: string | null
    client_type: Database['public']['Enums']['client_type']
  } | null
}

type AppointmentSelectorProps = {
  value: string | null
  onChange: (value: string | null) => void
  isInvalid?: boolean
  disabled?: boolean
}

export default function AppointmentSelector({
  value,
  onChange,
  isInvalid,
  disabled,
}: AppointmentSelectorProps) {
  // Fetch completed appointments that can be linked to cases
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['appointments-for-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            organization_name,
            client_type
          )
        `)
        .eq('status', 'completed')
        .order('scheduled_date', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return (data as Appointment[]) || []
    },
  })

  const getClientName = (appointment: Appointment): string => {
    if (!appointment.clients) return 'Unknown Client'
    const client = appointment.clients
    if (client.client_type === 'organization') {
      return client.organization_name || 'Unnamed Organization'
    }
    const firstName = client.first_name || ''
    const lastName = client.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Unnamed Person'
  }

  if (isLoading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span className="text-muted">Loading appointments...</span>
      </div>
    )
  }

  return (
    <Form.Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      isInvalid={isInvalid}
      disabled={disabled}
    >
      <option value="">No linked appointment (optional)</option>
      {appointments.map((appointment) => (
        <option key={appointment.id} value={appointment.id}>
          {appointment.scheduled_date} - {appointment.subject} ({getClientName(appointment)})
        </option>
      ))}
    </Form.Select>
  )
}

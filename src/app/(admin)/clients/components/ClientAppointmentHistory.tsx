import { Table, Spinner, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClientAppointments } from '../hooks/useClientAppointments'
import AppointmentStatusBadge from '@/app/(admin)/appointments/components/AppointmentStatusBadge'
import { formatDate, formatTime, formatDuration } from '@/app/(admin)/appointments/constants'

type ClientAppointmentHistoryProps = {
  clientId: string
}

export default function ClientAppointmentHistory({ clientId }: ClientAppointmentHistoryProps) {
  const { data: appointments, isLoading, error } = useClientAppointments(clientId)

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" variant="primary" />
        <span className="ms-2 text-muted">Loading appointment history...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="mb-0">
        <IconifyIcon icon="bx:error-circle" className="me-2" />
        Failed to load appointment history: {error.message}
      </Alert>
    )
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-4">
        <IconifyIcon icon="bx:calendar-x" className="fs-1 text-muted mb-2 d-block" />
        <p className="text-muted mb-0">No appointments found for this guest.</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <Table className="table-centered mb-0">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th>Date &amp; Time</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Location</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>
                <div className="fw-medium">{formatDate(appt.scheduled_date)}</div>
                <small className="text-muted">{formatTime(appt.scheduled_time)}</small>
              </td>
              <td>{appt.subject}</td>
              <td>
                <AppointmentStatusBadge status={appt.status} />
              </td>
              <td>
                {appt.location ? (
                  <span>
                    <IconifyIcon icon="bx:map-pin" className="me-1 text-muted" />
                    {appt.location}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td>{formatDuration(appt.duration_minutes)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

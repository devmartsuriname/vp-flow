import { Card, CardHeader, CardBody, Table, Spinner, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useRecentAppointments } from '../hooks'
import EmptyState from './EmptyState'

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  draft: 'secondary',
  pending_vp: 'warning',
  approved: 'success',
  rejected: 'danger',
  rescheduled: 'info',
  cancelled: 'dark',
  completed: 'primary',
}

const RecentAppointments = () => {
  const { data: appointments, isLoading, error } = useRecentAppointments(5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Recent Appointments</h5>
        </CardHeader>
        <CardBody className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Appointments"
        message="Unable to fetch recent appointments."
        icon="bx:error-circle"
      />
    )
  }

  if (!appointments || appointments.length === 0) {
    return (
      <EmptyState
        title="No Appointments"
        message="No appointments have been created yet."
        icon="bx:calendar"
      />
    )
  }

  const getClientName = (appointment: typeof appointments[0]) => {
    const client = appointment.clients
    if (!client) return 'Unknown Client'
    if (client.client_type === 'organization') {
      return client.organization_name || 'Unknown Organization'
    }
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown'
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Recent Appointments</h5>
        <Link to="/appointments" className="btn btn-sm btn-soft-primary">
          View All
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Guest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="text-nowrap">
                  {format(new Date(appointment.scheduled_date), 'MMM d, yyyy')}
                </td>
                <td>
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                    {appointment.subject}
                  </span>
                </td>
                <td>{getClientName(appointment)}</td>
                <td>
                  <Badge bg={STATUS_BADGE_VARIANTS[appointment.status] || 'secondary'}>
                    {appointment.status.replace('_', ' ')}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default RecentAppointments

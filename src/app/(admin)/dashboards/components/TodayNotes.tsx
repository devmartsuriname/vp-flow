import { Card, CardHeader, CardBody, Table, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useTodayNotes } from '../hooks'
import EmptyState from './EmptyState'

const TodayNotes = () => {
  const { data: notes, isLoading, error } = useTodayNotes(5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Today's Appointment Notes</h5>
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
        title="Error Loading Notes"
        message="Unable to fetch today's notes."
        icon="bx:error-circle"
      />
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        title="No Notes Today"
        message="No notes linked to today's appointments."
        icon="bx:calendar-check"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Today's Appointment Notes</h5>
        <Link to="/notes" className="btn btn-sm btn-soft-primary">
          View All
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Note</th>
              <th>Appointment</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>
                  <Link 
                    to={`/notes/${note.id}`} 
                    className="text-body text-decoration-none"
                  >
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '120px' }}>
                      {note.title || 'Untitled'}
                    </span>
                  </Link>
                </td>
                <td>
                  <span className="text-truncate d-inline-block text-muted" style={{ maxWidth: '120px' }}>
                    <IconifyIcon icon="bx:calendar" className="me-1" />
                    {note.appointment_subject || 'Appointment'}
                  </span>
                </td>
                <td className="text-nowrap text-muted">
                  {format(new Date(note.updated_at), 'HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default TodayNotes

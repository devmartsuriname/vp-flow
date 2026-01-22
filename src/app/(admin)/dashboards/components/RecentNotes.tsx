import { Card, CardHeader, CardBody, Table, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useRecentNotes } from '../hooks'
import EmptyState from './EmptyState'

const ENTITY_ICONS: Record<string, string> = {
  guest: 'bx:user',
  appointment: 'bx:calendar',
  case: 'bx:briefcase',
}

const RecentNotes = () => {
  const { data: notes, isLoading, error } = useRecentNotes(5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Recent Notes</h5>
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
        message="Unable to fetch recent notes."
        icon="bx:error-circle"
      />
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        title="No Notes"
        message="No notes have been created yet."
        icon="bx:note"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Recent Notes</h5>
        <Link to="/notes" className="btn btn-sm btn-soft-primary">
          View All
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Title</th>
              <th>Linked To</th>
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
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                      {note.title || 'Untitled'}
                    </span>
                  </Link>
                </td>
                <td className="text-center">
                  {note.note_link ? (
                    <IconifyIcon 
                      icon={ENTITY_ICONS[note.note_link.entity_type] || 'bx:link-alt'} 
                      className="fs-5 text-muted"
                      title={note.note_link.entity_type}
                    />
                  ) : (
                    <IconifyIcon 
                      icon="bx:link-alt" 
                      className="fs-5 text-muted opacity-50"
                      title="Unlinked"
                    />
                  )}
                </td>
                <td className="text-nowrap text-muted">
                  {format(new Date(note.updated_at), 'MMM d, HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default RecentNotes

import { useState } from 'react'
import { Table, Button, Spinner, Badge } from 'react-bootstrap'
import { format } from 'date-fns'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { AuditEventWithActor } from '../types'
import { AuditActionBadge } from './AuditActionBadge'
import { AuditLogDetailModal } from './AuditLogDetailModal'

interface AuditLogsTableProps {
  events: AuditEventWithActor[]
  isLoading: boolean
}

export function AuditLogsTable({ events, isLoading }: AuditLogsTableProps) {
  const [selectedEvent, setSelectedEvent] = useState<AuditEventWithActor | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewDetails = (event: AuditEventWithActor) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEvent(null)
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading audit logs...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-5">
        <IconifyIcon icon="bx:search-alt" className="fs-1 text-muted mb-2" />
        <p className="text-muted">No audit events found</p>
      </div>
    )
  }

  return (
    <>
      <Table responsive hover className="mb-0">
        <thead className="table-light">
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Entity Type</th>
            <th>Entity ID</th>
            <th className="text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <span className="text-nowrap">
                  {format(new Date(event.performed_at), 'PP')}
                </span>
                <br />
                <small className="text-muted">
                  {format(new Date(event.performed_at), 'p')}
                </small>
              </td>
              <td>
                {event.user_profiles?.full_name || (
                  <span className="text-muted fst-italic">Unknown</span>
                )}
              </td>
              <td>
                <AuditActionBadge action={event.action} />
              </td>
              <td>
                <Badge bg="light" text="dark" className="text-capitalize">
                  {event.entity_type}
                </Badge>
              </td>
              <td>
                <code className="small">{event.entity_id.slice(0, 8)}...</code>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetails(event)}
                  title="View Details"
                >
                  <IconifyIcon icon="bx:show" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AuditLogDetailModal
        show={showModal}
        onHide={handleCloseModal}
        event={selectedEvent}
      />
    </>
  )
}

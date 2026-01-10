import { Modal, ModalHeader, ModalTitle, ModalBody, Badge } from 'react-bootstrap'
import { format } from 'date-fns'
import type { AuditEventWithActor } from '../types'
import { AuditActionBadge } from './AuditActionBadge'

interface AuditLogDetailModalProps {
  show: boolean
  onHide: () => void
  event: AuditEventWithActor | null
}

export function AuditLogDetailModal({ show, onHide, event }: AuditLogDetailModalProps) {
  if (!event) return null

  const formatJson = (value: unknown) => {
    if (!value) return 'N/A'
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <ModalHeader closeButton>
        <ModalTitle>Audit Event Details</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <div className="row mb-3">
            <div className="col-sm-4">
              <strong>Timestamp:</strong>
            </div>
            <div className="col-sm-8">
              {format(new Date(event.performed_at), 'PPpp')}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4">
              <strong>Actor:</strong>
            </div>
            <div className="col-sm-8">
              {event.user_profiles?.full_name || 'Unknown User'}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4">
              <strong>Action:</strong>
            </div>
            <div className="col-sm-8">
              <AuditActionBadge action={event.action} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4">
              <strong>Entity Type:</strong>
            </div>
            <div className="col-sm-8">
              <Badge bg="light" text="dark" className="text-capitalize">
                {event.entity_type}
              </Badge>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4">
              <strong>Entity ID:</strong>
            </div>
            <div className="col-sm-8">
              <code>{event.entity_id}</code>
            </div>
          </div>

          {event.ip_address && (
            <div className="row mb-3">
              <div className="col-sm-4">
                <strong>IP Address:</strong>
              </div>
              <div className="col-sm-8">
                <code>{String(event.ip_address)}</code>
              </div>
            </div>
          )}

          {event.user_agent && (
            <div className="row mb-3">
              <div className="col-sm-4">
                <strong>User Agent:</strong>
              </div>
              <div className="col-sm-8 text-break">
                <small>{event.user_agent}</small>
              </div>
            </div>
          )}
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6">
            <h6 className="mb-2">Old Values</h6>
            <pre className="bg-light p-2 rounded" style={{ maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
              {formatJson(event.old_values)}
            </pre>
          </div>
          <div className="col-md-6">
            <h6 className="mb-2">New Values</h6>
            <pre className="bg-light p-2 rounded" style={{ maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
              {formatJson(event.new_values)}
            </pre>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

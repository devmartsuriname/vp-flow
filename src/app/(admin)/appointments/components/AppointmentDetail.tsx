import { Card, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import { formatDate, formatTime, formatDuration, VISIBILITY_LABELS } from '../constants'
import { getClientDisplayName, type AppointmentWithClient } from '../types'
import { isVP, isProtocol } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import { LinkedDocuments } from '@/app/(admin)/documents/components'
import { LinkedNotes } from '@/app/(admin)/notes/components'

type AppointmentDetailProps = {
  appointment: AppointmentWithClient
  userRole: VPFlowRole | null
}

export default function AppointmentDetail({
  appointment,
  userRole,
}: AppointmentDetailProps) {
  return (
    <>
      {/* Status Banner */}
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{appointment.subject}</h5>
            <span className="text-muted">
              {formatDate(appointment.scheduled_date)} at {formatTime(appointment.scheduled_time)}
            </span>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </Card.Body>
      </Card>

      <Row>
        {/* Appointment Details */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Appointment Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Date:</strong>
                </Col>
                <Col sm={8}>{formatDate(appointment.scheduled_date)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Time:</strong>
                </Col>
                <Col sm={8}>{formatTime(appointment.scheduled_time)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Duration:</strong>
                </Col>
                <Col sm={8}>{formatDuration(appointment.duration_minutes)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Location:</strong>
                </Col>
                <Col sm={8}>{appointment.location || '—'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Visibility:</strong>
                </Col>
                <Col sm={8}>
                  <Badge bg={appointment.visibility === 'vp_only' ? 'dark' : 'secondary'}>
                    {VISIBILITY_LABELS[appointment.visibility]}
                  </Badge>
                </Col>
              </Row>
              {appointment.description && (
                <Row>
                  <Col sm={4}>
                    <strong>Description:</strong>
                  </Col>
                  <Col sm={8}>
                    <p className="mb-0 text-muted">{appointment.description}</p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Guest Information */}
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Guest</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{getClientDisplayName(appointment.clients)}</h6>
                  {appointment.clients && (
                    <Badge bg={appointment.clients.client_type === 'organization' ? 'info' : 'secondary'}>
                      {appointment.clients.client_type}
                    </Badge>
                  )}
                </div>
                {appointment.clients && (
                  <Link
                    to={`/clients/${appointment.clients.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Guest
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Documents Section (VP/Secretary only - Protocol blocked) */}
          {!isProtocol(userRole) && (
            <LinkedDocuments
              entityType="appointment"
              entityId={appointment.id}
              entityName={appointment.subject}
              userRole={userRole}
            />
          )}

          {/* VP Notes Section (VP-only) */}
          <LinkedNotes
            entityType="appointment"
            entityId={appointment.id}
            entityName={appointment.subject}
            userRole={userRole}
          />

          {/* Rejection Details (if rejected) */}
          {appointment.status === 'rejected' && appointment.rejection_reason && (
            <Card className="mb-3 border-danger">
              <Card.Header className="bg-danger bg-opacity-10">
                <h5 className="mb-0 text-danger">Rejection Details</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{appointment.rejection_reason}</p>
                {appointment.rejected_at && (
                  <small className="text-muted">
                    Rejected on {new Date(appointment.rejected_at).toLocaleString()}
                  </small>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col md={4}>
          {/* VP Notes (VP only) */}
          {isVP(userRole) && (
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">VP Notes</h5>
              </Card.Header>
              <Card.Body>
                {appointment.vp_notes ? (
                  <p className="mb-0">{appointment.vp_notes}</p>
                ) : (
                  <p className="mb-0 text-muted">No VP notes added.</p>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Metadata */}
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <small className="text-muted d-block">Created</small>
                <span>{new Date(appointment.created_at).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Last Updated</small>
                <span>{new Date(appointment.updated_at).toLocaleString()}</span>
              </div>
              {appointment.submitted_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Submitted</small>
                  <span>{new Date(appointment.submitted_at).toLocaleString()}</span>
                </div>
              )}
              {appointment.approved_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Approved</small>
                  <span>{new Date(appointment.approved_at).toLocaleString()}</span>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Case Creation Placeholder (VP only) */}
          {isVP(userRole) && appointment.status === 'completed' && (
            <Card className="mb-3 border-primary">
              <Card.Header className="bg-primary bg-opacity-10">
                <h5 className="mb-0">Cases</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-0">
                  Case creation will be available in the Cases module.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  )
}

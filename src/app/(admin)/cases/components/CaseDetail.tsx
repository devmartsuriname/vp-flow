import { Card, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CaseStatusBadge from './CaseStatusBadge'
import CasePriorityBadge from './CasePriorityBadge'
import { formatDate, formatDateTime, isOverdue } from '../constants'
import { getClientDisplayName, type CaseWithAppointment } from '../types'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import { LinkedDocuments } from '@/app/(admin)/documents/components'
import { LinkedNotes } from '@/app/(admin)/notes/components'

type CaseDetailProps = {
  caseItem: CaseWithAppointment
  userRole: VPFlowRole | null
}

export default function CaseDetail({
  caseItem,
  userRole,
}: CaseDetailProps) {
  const isClosed = caseItem.status === 'closed'
  const deadlineOverdue = !isClosed && isOverdue(caseItem.deadline)

  return (
    <>
      {/* Status Banner */}
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{caseItem.title}</h5>
            <span className="text-muted font-monospace">{caseItem.case_number}</span>
          </div>
          <div className="d-flex gap-2">
            <CasePriorityBadge priority={caseItem.priority} />
            <CaseStatusBadge status={caseItem.status} />
          </div>
        </Card.Body>
      </Card>

      {/* Immutability Notice for Closed Cases */}
      {isClosed && (
        <Card className="mb-3 border-success">
          <Card.Body className="d-flex align-items-center gap-2 bg-success bg-opacity-10">
            <Badge bg="success">CLOSED</Badge>
            <span className="text-success fw-medium">
              This case is closed. Only VP can re-open if needed.
            </span>
          </Card.Body>
        </Card>
      )}

      {/* Reopened State Warning Banner */}
      {caseItem.status === 'reopened' && (
        <Card className="mb-3 border-warning">
          <Card.Body className="d-flex align-items-center gap-2 bg-warning bg-opacity-10">
            <Badge bg="warning" text="dark">REOPENED</Badge>
            <span className="text-warning fw-medium">
              This case has been re-opened for additional work. Close again when complete.
            </span>
          </Card.Body>
        </Card>
      )}

      <Row>
        {/* Case Details */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Case Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Case Number:</strong>
                </Col>
                <Col sm={8} className="font-monospace">{caseItem.case_number}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Priority:</strong>
                </Col>
                <Col sm={8}>
                  <CasePriorityBadge priority={caseItem.priority} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Status:</strong>
                </Col>
                <Col sm={8}>
                  <CaseStatusBadge status={caseItem.status} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Deadline:</strong>
                </Col>
                <Col sm={8}>
                  <span className={deadlineOverdue ? 'text-danger fw-medium' : ''}>
                    {formatDate(caseItem.deadline)}
                    {deadlineOverdue && (
                      <Badge bg="danger" className="ms-2">Overdue</Badge>
                    )}
                  </span>
                </Col>
              </Row>
              {caseItem.description && (
                <Row>
                  <Col sm={4}>
                    <strong>Description:</strong>
                  </Col>
                  <Col sm={8}>
                    <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                      {caseItem.description}
                    </p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Linked Appointment */}
          {caseItem.appointments && (
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">Linked Appointment</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{caseItem.appointments.subject}</h6>
                    <div className="text-muted small mb-1">
                      {formatDate(caseItem.appointments.scheduled_date)}
                    </div>
                    <span className="text-muted">
                      Guest: {getClientDisplayName(caseItem.appointments)}
                    </span>
                  </div>
                  <Link
                    to={`/appointments/${caseItem.appointments.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Appointment
                  </Link>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Documents Section */}
          <LinkedDocuments
            entityType="case"
            entityId={caseItem.id}
            entityName={caseItem.title}
            userRole={userRole}
            readOnly={isClosed && caseItem.status !== 'reopened'}
          />

          {/* VP Notes Section */}
          <LinkedNotes
            entityType="case"
            entityId={caseItem.id}
            entityName={caseItem.title}
            userRole={userRole}
            readOnly={isClosed && caseItem.status !== 'reopened'}
          />

          {/* Resolution Summary (if closed) */}
          {isClosed && caseItem.resolution_summary && (
            <Card className="mb-3 border-success">
              <Card.Header className="bg-success bg-opacity-10">
                <h5 className="mb-0 text-success">Resolution Summary</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {caseItem.resolution_summary}
                </p>
                {caseItem.closed_at && (
                  <small className="text-muted d-block mt-2">
                    Closed on {formatDateTime(caseItem.closed_at)}
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
                {caseItem.vp_notes ? (
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {caseItem.vp_notes}
                  </p>
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
                <span>{formatDateTime(caseItem.created_at)}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Last Updated</small>
                <span>{formatDateTime(caseItem.updated_at)}</span>
              </div>
              {caseItem.opened_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Opened</small>
                  <span>{formatDateTime(caseItem.opened_at)}</span>
                </div>
              )}
              {caseItem.closed_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Closed</small>
                  <span>{formatDateTime(caseItem.closed_at)}</span>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

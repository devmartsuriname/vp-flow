import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import IncomingPostStatusBadge from './IncomingPostStatusBadge'
import IncomingPostUrgencyBadge from './IncomingPostUrgencyBadge'
import { formatDate, formatDateTime, CATEGORY_LABELS } from '../constants'
import { STATUS_TRANSITIONS, isVPOnlyTransition, type IncomingPost, type IncomingPostStatus } from '../types'
import { isVP, isSecretary } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import { LinkedDocuments } from '@/app/(admin)/documents/components'

type Props = {
  post: IncomingPost
  userRole: VPFlowRole | null
  onStatusAction: (targetStatus: IncomingPostStatus) => void
  isUpdating: boolean
}

export default function IncomingPostDetail({ post, userRole, onStatusAction, isUpdating }: Props) {
  const isArchived = post.status === 'archived'
  const isClosed = post.status === 'closed'
  const availableTransitions = STATUS_TRANSITIONS[post.status] || []

  // Filter transitions based on role
  const allowedTransitions = availableTransitions.filter((t) => {
    if (isVPOnlyTransition(t)) return isVP(userRole)
    return isVP(userRole) || isSecretary(userRole)
  })

  return (
    <>
      {/* Header */}
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{post.subject}</h5>
            <span className="text-muted font-monospace">{post.reference_number}</span>
          </div>
          <div className="d-flex gap-2">
            <IncomingPostUrgencyBadge urgency={post.urgency} />
            <IncomingPostStatusBadge status={post.status} />
          </div>
        </Card.Body>
      </Card>

      {/* Archive notice */}
      {isArchived && (
        <Card className="mb-3 border-secondary">
          <Card.Body className="d-flex align-items-center gap-2 bg-secondary bg-opacity-10">
            <Badge bg="secondary">ARCHIVED</Badge>
            <span className="text-secondary fw-medium">
              This post is archived. No modifications are possible.
            </span>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={8}>
          {/* Details */}
          <Card className="mb-3">
            <Card.Header><h5 className="mb-0">Post Details</h5></Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4}><strong>Reference:</strong></Col>
                <Col sm={8} className="font-monospace">{post.reference_number}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Category:</strong></Col>
                <Col sm={8}>{CATEGORY_LABELS[post.category]}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Sender:</strong></Col>
                <Col sm={8}>
                  {post.sender_name}
                  {post.sender_organization && (
                    <span className="text-muted"> — {post.sender_organization}</span>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Received:</strong></Col>
                <Col sm={8}>{formatDate(post.received_date)}</Col>
              </Row>
              {post.description && (
                <Row className="mb-3">
                  <Col sm={4}><strong>Description:</strong></Col>
                  <Col sm={8}>
                    <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{post.description}</p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Advice Section */}
          {(post.advice_request || post.advice_response) && (
            <Card className="mb-3 border-info">
              <Card.Header className="bg-info bg-opacity-10">
                <h5 className="mb-0 text-info">Advice</h5>
              </Card.Header>
              <Card.Body>
                {post.advice_request && (
                  <div className="mb-3">
                    <strong>Advice Requested:</strong>
                    <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{post.advice_request}</p>
                  </div>
                )}
                {post.advice_response && (
                  <div>
                    <strong>Advice Response:</strong>
                    <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{post.advice_response}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Forwarding info */}
          {post.forwarding_destination && (
            <Card className="mb-3 border-success">
              <Card.Header className="bg-success bg-opacity-10">
                <h5 className="mb-0 text-success">Forwarding</h5>
              </Card.Header>
              <Card.Body>
                <strong>Destination:</strong> {post.forwarding_destination}
                {post.forwarded_at && (
                  <div className="text-muted small mt-1">
                    Forwarded on {formatDateTime(post.forwarded_at)}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Rejection info */}
          {post.rejection_reason && (
            <Card className="mb-3 border-danger">
              <Card.Header className="bg-danger bg-opacity-10">
                <h5 className="mb-0 text-danger">Rejection</h5>
              </Card.Header>
              <Card.Body>
                <strong>Reason:</strong>
                <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{post.rejection_reason}</p>
                {post.rejected_at && (
                  <div className="text-muted small mt-1">
                    Rejected on {formatDateTime(post.rejected_at)}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Linked Appointment */}
          {post.linked_appointment_id && (
            <Card className="mb-3">
              <Card.Header><h5 className="mb-0">Linked Appointment</h5></Card.Header>
              <Card.Body>
                <Link to={`/appointments/${post.linked_appointment_id}`} className="btn btn-outline-primary btn-sm">
                  <IconifyIcon icon="bx:calendar" className="me-1" />
                  View Appointment
                </Link>
              </Card.Body>
            </Card>
          )}

          {/* Linked Documents */}
          <LinkedDocuments
            entityType="incoming_post"
            entityId={post.id}
            entityName={post.subject}
            userRole={userRole}
            readOnly={isArchived || isClosed}
          />

          {/* Status Actions */}
          {allowedTransitions.length > 0 && (
            <Card className="mb-3">
              <Card.Header><h5 className="mb-0">Actions</h5></Card.Header>
              <Card.Body className="d-flex gap-2 flex-wrap">
                {allowedTransitions.map((targetStatus) => {
                  const variant = targetStatus === 'rejected' ? 'danger'
                    : targetStatus === 'archived' ? 'warning'
                    : targetStatus === 'closed' ? 'dark'
                    : 'primary'
                  const labels: Record<string, string> = {
                    registered: 'Register',
                    forwarded: 'Forward',
                    waiting_advice: 'Request Advice',
                    advice_received: 'Provide Advice',
                    rejected: 'Reject',
                    appointment_created: 'Create Appointment',
                    closed: 'Close',
                    archived: 'Archive',
                  }
                  return (
                    <Button
                      key={targetStatus}
                      variant={variant}
                      onClick={() => onStatusAction(targetStatus)}
                      disabled={isUpdating}
                      size="sm"
                    >
                      {labels[targetStatus] || targetStatus}
                    </Button>
                  )
                })}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header><h5 className="mb-0">Information</h5></Card.Header>
            <Card.Body>
              <div className="mb-2">
                <small className="text-muted d-block">Created</small>
                <span>{formatDateTime(post.created_at)}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Last Updated</small>
                <span>{formatDateTime(post.updated_at)}</span>
              </div>
              {post.registered_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Registered</small>
                  <span>{formatDateTime(post.registered_at)}</span>
                </div>
              )}
              {post.closed_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Closed</small>
                  <span>{formatDateTime(post.closed_at)}</span>
                </div>
              )}
              {post.archived_at && (
                <div className="mb-2">
                  <small className="text-muted d-block">Archived</small>
                  <span>{formatDateTime(post.archived_at)}</span>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

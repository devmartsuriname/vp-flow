import { Card, Row, Col, Badge, Button, Tab, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { Client } from '../types'
import { getClientDisplayName } from '../types'
import ClientAppointmentHistory from './ClientAppointmentHistory'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import { format } from 'date-fns'
import { LinkedDocuments } from '@/app/(admin)/documents/components'
import { LinkedNotes } from '@/app/(admin)/notes/components'

type ClientDetailProps = {
  client: Client
  clientId: string
  userRole: VPFlowRole | null
  onDelete?: () => void
}

export default function ClientDetail({ 
  client, 
  clientId,
  userRole,
  onDelete 
}: ClientDetailProps) {
  return (
    <Tab.Container defaultActiveKey="details">
      {/* Navigation Tabs */}
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="details">
            <IconifyIcon icon="bx:user" className="me-1" />
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">
            <IconifyIcon icon="bx:history" className="me-1" />
            History
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="documents">
            <IconifyIcon icon="bx:file" className="me-1" />
            Documents
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content>
        {/* Details Tab */}
        <Tab.Pane eventKey="details">
          <Row>
            <Col lg={8}>
              {/* Basic Info Card */}
              <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:info-circle" className="me-2" />
                    Basic Information
                  </h5>
                  <Badge 
                    bg={client.client_type === 'organization' ? 'info' : 'secondary'}
                    className="text-capitalize"
                  >
                    {client.client_type}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Name:</strong>{' '}
                        {getClientDisplayName(client)}
                      </p>
                      {client.client_type === 'organization' && client.contact_person && (
                        <p className="mb-2">
                          <strong>Contact Person:</strong>{' '}
                          {client.contact_person}
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Email:</strong>{' '}
                        {client.email ? (
                          <a href={`mailto:${client.email}`}>{client.email}</a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong>{' '}
                        {client.phone ? (
                          <a href={`tel:${client.phone}`}>{client.phone}</a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Address Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:map" className="me-2" />
                    Address
                  </h5>
                </Card.Header>
                <Card.Body>
                  {client.address_line1 || client.city || client.district ? (
                    <>
                      {client.address_line1 && <p className="mb-1">{client.address_line1}</p>}
                      {client.address_line2 && <p className="mb-1">{client.address_line2}</p>}
                      <p className="mb-0">
                        {[client.city, client.district].filter(Boolean).join(', ') || '—'}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted mb-0">No address on file</p>
                  )}
                </Card.Body>
              </Card>

              {/* Notes Card (VP/Secretary only) */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:note" className="me-2" />
                    Internal Notes
                  </h5>
                </Card.Header>
                <Card.Body>
                  {client.notes ? (
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {client.notes}
                    </p>
                  ) : (
                    <p className="text-muted mb-0">No notes recorded</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Actions Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">Actions</h5>
                </Card.Header>
                <Card.Body className="d-grid gap-2">
                  <Link 
                    to={`/clients/${client.id}/edit`} 
                    className="btn btn-primary"
                  >
                    <IconifyIcon icon="bx:edit" className="me-2" />
                    Edit Guest
                  </Link>
                  {isVP(userRole) && onDelete && (
                    <Button variant="outline-danger" onClick={onDelete}>
                      <IconifyIcon icon="bx:trash" className="me-2" />
                      Delete Guest
                    </Button>
                  )}
                </Card.Body>
              </Card>

              {/* Metadata Card */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Record Info</h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-2 small">
                    <strong>Created:</strong>{' '}
                    {format(new Date(client.created_at), 'PPp')}
                  </p>
                  <p className="mb-0 small">
                    <strong>Last Updated:</strong>{' '}
                    {format(new Date(client.updated_at), 'PPp')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>

        {/* History Tab */}
        <Tab.Pane eventKey="history">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <IconifyIcon icon="bx:history" className="me-2" />
                Appointment History
              </h5>
            </Card.Header>
            <Card.Body>
              <ClientAppointmentHistory clientId={clientId} />
            </Card.Body>
          </Card>
        </Tab.Pane>

        {/* Documents Tab */}
        <Tab.Pane eventKey="documents">
          <LinkedDocuments
            entityType="guest"
            entityId={clientId}
            entityName={getClientDisplayName(client)}
            userRole={userRole}
          />
          <LinkedNotes
            entityType="guest"
            entityId={clientId}
            entityName={getClientDisplayName(client)}
            userRole={userRole}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  )
}

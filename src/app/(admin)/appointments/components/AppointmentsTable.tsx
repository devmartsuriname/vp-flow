import { Table, Button, Spinner, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import { formatDate, formatTime, STATUS_LABELS } from '../constants'
import { getClientDisplayName, type AppointmentWithClient, type AppointmentStatus } from '../types'
import { isVP, isProtocol } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

type AppointmentsTableProps = {
  appointments: AppointmentWithClient[]
  isLoading: boolean
  userRole: VPFlowRole | null
}

export default function AppointmentsTable({
  appointments,
  isLoading,
  userRole,
}: AppointmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('')

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Status filter
      if (statusFilter && appointment.status !== statusFilter) {
        return false
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const clientName = getClientDisplayName(appointment.clients).toLowerCase()
        const subject = appointment.subject.toLowerCase()
        return clientName.includes(term) || subject.includes(term)
      }

      return true
    })
  }, [appointments, searchTerm, statusFilter])

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading appointments...</p>
      </div>
    )
  }

  // Available statuses for filter (based on role)
  const availableStatuses: AppointmentStatus[] = isProtocol(userRole)
    ? ['approved']
    : ['draft', 'pending_vp', 'approved', 'rejected', 'rescheduled', 'cancelled', 'completed']

  return (
    <>
      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <IconifyIcon icon="bx:search" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by client or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                <IconifyIcon icon="bx:x" />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | '')}
          >
            <option value="">All Statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Results count */}
      <div className="mb-2 text-muted small">
        Showing {filteredAppointments.length} of {appointments.length} appointments
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Date & Time</th>
              <th>Subject</th>
              <th>Client</th>
              <th>Duration</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  {searchTerm || statusFilter
                    ? 'No appointments found matching your filters'
                    : 'No appointments yet'}
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div>{formatDate(appointment.scheduled_date)}</div>
                    <small className="text-muted">
                      {formatTime(appointment.scheduled_time)}
                    </small>
                  </td>
                  <td>
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="text-body fw-medium"
                    >
                      {appointment.subject}
                    </Link>
                  </td>
                  <td>{getClientDisplayName(appointment.clients)}</td>
                  <td>{appointment.duration_minutes} min</td>
                  <td>
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="btn btn-sm btn-soft-primary me-1"
                      title="View"
                    >
                      <IconifyIcon icon="bx:show" />
                    </Link>
                    {/* Edit only for VP or non-terminal statuses */}
                    {isVP(userRole) && !['rejected', 'cancelled', 'completed'].includes(appointment.status) && (
                      <Link
                        to={`/appointments/${appointment.id}/edit`}
                        className="btn btn-sm btn-soft-info"
                        title="Edit"
                      >
                        <IconifyIcon icon="bx:edit" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

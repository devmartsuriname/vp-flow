import { Table, Button, Spinner, Form, InputGroup, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import CaseStatusBadge from './CaseStatusBadge'
import CasePriorityBadge from './CasePriorityBadge'
import { formatDate, isOverdue, STATUS_LABELS, PRIORITY_LABELS } from '../constants'
import { getClientDisplayName, type CaseWithAppointment, type CaseStatus, type CasePriority } from '../types'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

type CasesTableProps = {
  cases: CaseWithAppointment[]
  isLoading: boolean
  userRole: VPFlowRole | null
}

export default function CasesTable({
  cases,
  isLoading,
  userRole,
}: CasesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<CasePriority | ''>('')

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      // Status filter
      if (statusFilter && caseItem.status !== statusFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter && caseItem.priority !== priorityFilter) {
        return false
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const title = caseItem.title.toLowerCase()
        const caseNumber = caseItem.case_number.toLowerCase()
        const clientName = getClientDisplayName(caseItem.appointments).toLowerCase()
        return title.includes(term) || caseNumber.includes(term) || clientName.includes(term)
      }

      return true
    })
  }, [cases, searchTerm, statusFilter, priorityFilter])

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading cases...</p>
      </div>
    )
  }

  const availableStatuses: CaseStatus[] = ['draft', 'open', 'in_progress', 'parked', 'closed']
  const availablePriorities: CasePriority[] = ['high', 'medium', 'low']

  return (
    <>
      {/* Filters */}
      <Row className="mb-3">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>
              <IconifyIcon icon="bx:search" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title, case number, or client..."
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
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
          >
            <option value="">All Statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as CasePriority | '')}
          >
            <option value="">All Priorities</option>
            {availablePriorities.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Results count */}
      <div className="mb-2 text-muted small">
        Showing {filteredCases.length} of {cases.length} cases
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Case #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Deadline</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  {searchTerm || statusFilter || priorityFilter
                    ? 'No cases found matching your filters'
                    : 'No cases yet'}
                </td>
              </tr>
            ) : (
              filteredCases.map((caseItem) => {
                const deadlineOverdue = caseItem.status !== 'closed' && isOverdue(caseItem.deadline)
                return (
                  <tr key={caseItem.id}>
                    <td>
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="text-body fw-medium font-monospace"
                      >
                        {caseItem.case_number}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="text-body"
                      >
                        {caseItem.title}
                      </Link>
                    </td>
                    <td>{getClientDisplayName(caseItem.appointments)}</td>
                    <td>
                      <CasePriorityBadge priority={caseItem.priority} />
                    </td>
                    <td>
                      <CaseStatusBadge status={caseItem.status} />
                    </td>
                    <td>
                      <div className={deadlineOverdue ? 'text-danger fw-medium' : ''}>
                        {formatDate(caseItem.deadline)}
                        {deadlineOverdue && (
                          <Badge bg="danger" className="ms-1">Overdue</Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="btn btn-sm btn-soft-primary me-1"
                        title="View"
                      >
                        <IconifyIcon icon="bx:show" />
                      </Link>
                      {/* Edit only for VP and non-closed cases */}
                      {isVP(userRole) && caseItem.status !== 'closed' && (
                        <Link
                          to={`/cases/${caseItem.id}/edit`}
                          className="btn btn-sm btn-soft-info"
                          title="Edit"
                        >
                          <IconifyIcon icon="bx:edit" />
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

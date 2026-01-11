import { Card, CardHeader, CardBody, Table, Spinner, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useRecentCases } from '../hooks'
import EmptyState from './EmptyState'

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  draft: 'secondary',
  open: 'primary',
  in_progress: 'info',
  parked: 'warning',
  closed: 'success',
}

const PRIORITY_BADGE_VARIANTS: Record<string, string> = {
  high: 'danger',
  medium: 'warning',
  low: 'secondary',
}

const RecentCases = () => {
  const { data: cases, isLoading, error } = useRecentCases(5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Recent Cases</h5>
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
        title="Error Loading Cases"
        message="Unable to fetch recent cases."
        icon="bx:error-circle"
      />
    )
  }

  if (!cases || cases.length === 0) {
    return (
      <EmptyState
        title="No Cases"
        message="No cases have been created yet."
        icon="bx:briefcase"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Recent Cases</h5>
        <Link to="/cases" className="btn btn-sm btn-soft-primary">
          View All
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Case #</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td className="text-nowrap fw-medium">{caseItem.case_number}</td>
                <td>
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                    {caseItem.title}
                  </span>
                </td>
                <td>
                  <Badge bg={STATUS_BADGE_VARIANTS[caseItem.status] || 'secondary'}>
                    {caseItem.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td>
                  <Badge bg={PRIORITY_BADGE_VARIANTS[caseItem.priority] || 'secondary'}>
                    {caseItem.priority}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default RecentCases

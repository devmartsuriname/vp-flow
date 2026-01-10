import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface EmptyStateProps {
  hasFilters?: boolean
}

/**
 * Empty state when no users match filters
 */
export const EmptyState = ({ hasFilters = false }: EmptyStateProps) => {
  return (
    <Card className="text-center py-5">
      <CardBody>
        <IconifyIcon icon="bx:user-x" className="fs-1 text-muted mb-3" />
        <h5 className="text-muted">
          {hasFilters ? 'No users match your filters' : 'No users found'}
        </h5>
        <p className="text-muted mb-0">
          {hasFilters
            ? 'Try adjusting your search or filter criteria.'
            : 'There are no users in the system yet.'}
        </p>
      </CardBody>
    </Card>
  )
}

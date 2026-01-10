import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface EmptyStateProps {
  message?: string
}

const EmptyState = ({ message = 'No notifications to display' }: EmptyStateProps) => {
  return (
    <Card className="text-center py-5">
      <CardBody>
        <div className="mb-3">
          <IconifyIcon icon="bx:bell-off" className="fs-48 text-muted" />
        </div>
        <h5 className="text-muted mb-0">{message}</h5>
      </CardBody>
    </Card>
  )
}

export default EmptyState

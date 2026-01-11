import { Card, CardBody } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface EmptyStateProps {
  title: string
  message: string
  icon?: string
}

const EmptyState = ({ title, message, icon = 'bx:folder-open' }: EmptyStateProps) => {
  return (
    <Card>
      <CardBody className="text-center py-5">
        <div className="mb-3">
          <Icon icon={icon} width={48} height={48} className="text-muted" />
        </div>
        <h5 className="text-muted mb-2">{title}</h5>
        <p className="text-muted mb-0">{message}</p>
      </CardBody>
    </Card>
  )
}

export default EmptyState

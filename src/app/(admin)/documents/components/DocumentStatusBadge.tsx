import { Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { STATUS_CONFIG, type DocumentStatus } from '../types'

type DocumentStatusBadgeProps = {
  status: DocumentStatus | null | undefined
}

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  if (!status) {
    return <Badge bg="secondary">Unknown</Badge>
  }

  const config = STATUS_CONFIG[status]

  return (
    <Badge bg={config.variant}>
      <IconifyIcon icon={config.icon} className="me-1" />
      {config.label}
    </Badge>
  )
}

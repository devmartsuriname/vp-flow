import { Badge } from 'react-bootstrap'
import { STATUS_BADGE_VARIANTS, STATUS_LABELS } from '../constants'
import type { AppointmentStatus } from '../types'

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus
}

export default function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const variant = STATUS_BADGE_VARIANTS[status] || 'secondary'
  const label = STATUS_LABELS[status] || status

  return (
    <Badge bg={variant} className="text-capitalize">
      {label}
    </Badge>
  )
}

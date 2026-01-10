import { Badge } from 'react-bootstrap'
import { STATUS_BADGE_VARIANTS, STATUS_LABELS } from '../constants'
import type { CaseStatus } from '../types'

type CaseStatusBadgeProps = {
  status: CaseStatus
}

export default function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  const variant = STATUS_BADGE_VARIANTS[status] || 'secondary'
  const label = STATUS_LABELS[status] || status

  return (
    <Badge bg={variant} className="text-capitalize">
      {label}
    </Badge>
  )
}

import { Badge } from 'react-bootstrap'
import { PRIORITY_BADGE_VARIANTS, PRIORITY_LABELS } from '../constants'
import type { CasePriority } from '../types'

type CasePriorityBadgeProps = {
  priority: CasePriority
}

export default function CasePriorityBadge({ priority }: CasePriorityBadgeProps) {
  const variant = PRIORITY_BADGE_VARIANTS[priority] || 'secondary'
  const label = PRIORITY_LABELS[priority] || priority

  return (
    <Badge bg={variant} className="text-capitalize">
      {label}
    </Badge>
  )
}

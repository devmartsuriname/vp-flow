import { Badge } from 'react-bootstrap'
import type { AuditAction } from '../types'
import { ACTION_BADGE_VARIANTS, ACTION_LABELS } from '../constants'

interface AuditActionBadgeProps {
  action: AuditAction
}

export function AuditActionBadge({ action }: AuditActionBadgeProps) {
  const variant = ACTION_BADGE_VARIANTS[action] || 'secondary'
  const label = ACTION_LABELS[action] || action

  return (
    <Badge bg={variant} className="text-capitalize">
      {label}
    </Badge>
  )
}

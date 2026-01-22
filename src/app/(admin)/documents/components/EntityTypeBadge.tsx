import { Badge } from 'react-bootstrap'
import { ENTITY_TYPE_LABELS } from '../constants'
import type { DocumentEntityType } from '../types'

type EntityTypeBadgeProps = {
  entityType: DocumentEntityType
}

const ENTITY_BADGE_VARIANTS: Record<DocumentEntityType, string> = {
  case: 'primary',
  appointment: 'info',
  guest: 'secondary',
  none: 'light',
}

export default function EntityTypeBadge({ entityType }: EntityTypeBadgeProps) {
  const variant = ENTITY_BADGE_VARIANTS[entityType] || 'secondary'
  const label = ENTITY_TYPE_LABELS[entityType] || entityType

  return (
    <Badge bg={variant} className="text-capitalize">
      {label}
    </Badge>
  )
}

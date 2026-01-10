import { Badge } from 'react-bootstrap'
import type { AppRole } from '../types'
import { ROLE_BADGE_VARIANTS, ROLE_LABELS } from '../constants'

interface RoleBadgeProps {
  role: AppRole | null
  showPlaceholder?: boolean
}

/**
 * Role badge component displaying user role with appropriate color
 */
export const RoleBadge = ({ role, showPlaceholder = true }: RoleBadgeProps) => {
  if (!role) {
    return showPlaceholder ? (
      <span className="text-muted">—</span>
    ) : null
  }

  return (
    <Badge bg={ROLE_BADGE_VARIANTS[role]} className="text-uppercase">
      {ROLE_LABELS[role]}
    </Badge>
  )
}

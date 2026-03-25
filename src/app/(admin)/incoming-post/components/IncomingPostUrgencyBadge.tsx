import { Badge } from 'react-bootstrap'
import { URGENCY_BADGE_VARIANTS, URGENCY_LABELS } from '../constants'
import type { IncomingPostUrgency } from '../types'

type Props = { urgency: IncomingPostUrgency }

export default function IncomingPostUrgencyBadge({ urgency }: Props) {
  return (
    <Badge bg={URGENCY_BADGE_VARIANTS[urgency] || 'secondary'} className="text-capitalize">
      {URGENCY_LABELS[urgency] || urgency}
    </Badge>
  )
}

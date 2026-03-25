import { Badge } from 'react-bootstrap'
import { STATUS_BADGE_VARIANTS, STATUS_LABELS } from '../constants'
import type { IncomingPostStatus } from '../types'

type Props = { status: IncomingPostStatus }

export default function IncomingPostStatusBadge({ status }: Props) {
  return (
    <Badge bg={STATUS_BADGE_VARIANTS[status] || 'secondary'} className="text-capitalize">
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}

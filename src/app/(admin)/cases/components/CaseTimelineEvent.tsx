import { ListGroupItem } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { TimelineEvent } from '../types'
import { formatRelativeTime, formatDateTime } from '../constants'

interface CaseTimelineEventProps {
  event: TimelineEvent
}

const eventConfig: Record<TimelineEvent['type'], { icon: string; colorClass: string }> = {
  created: { icon: 'bx:plus-circle', colorClass: 'text-success' },
  opened: { icon: 'bx:folder-open', colorClass: 'text-info' },
  status_change: { icon: 'bx:transfer-alt', colorClass: 'text-primary' },
  priority_change: { icon: 'bx:flag', colorClass: 'text-warning' },
  deadline_change: { icon: 'bx:calendar-edit', colorClass: 'text-warning' },
  closed: { icon: 'bx:check-circle', colorClass: 'text-success' },
  updated: { icon: 'bx:edit', colorClass: 'text-secondary' },
}

const CaseTimelineEvent = ({ event }: CaseTimelineEventProps) => {
  const config = eventConfig[event.type] || eventConfig.updated

  return (
    <ListGroupItem className="d-flex align-items-start gap-3 py-3">
      <div className={`${config.colorClass} fs-4`}>
        <IconifyIcon icon={config.icon} />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="mb-1 fw-medium">{event.description}</p>
            {event.actorName && (
              <small className="text-muted">by {event.actorName}</small>
            )}
          </div>
          <div className="text-end">
            <small className="text-muted d-block">{formatRelativeTime(event.timestamp)}</small>
            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
              {formatDateTime(event.timestamp)}
            </small>
          </div>
        </div>
      </div>
    </ListGroupItem>
  )
}

export default CaseTimelineEvent

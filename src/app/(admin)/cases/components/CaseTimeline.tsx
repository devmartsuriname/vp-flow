import { Card, CardBody, CardHeader, ListGroup, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCaseTimeline } from '../hooks/useCaseTimeline'
import CaseTimelineEvent from './CaseTimelineEvent'
import type { CaseWithAppointment } from '../types'
import type { VPFlowRole } from '@/types/auth'
import { isVP } from '@/hooks/useUserRole'

interface CaseTimelineProps {
  caseItem: CaseWithAppointment
  userRole: VPFlowRole | null
}

const CaseTimeline = ({ caseItem, userRole }: CaseTimelineProps) => {
  const { data: events, isLoading } = useCaseTimeline(caseItem, userRole)

  return (
    <Card className="mt-3">
      <CardHeader className="d-flex align-items-center gap-2">
        <IconifyIcon icon="bx:history" className="fs-5" />
        <span className="fw-semibold">Case History</span>
        {!isVP(userRole) && (
          <small className="text-muted ms-auto">(Basic view)</small>
        )}
      </CardHeader>
      <CardBody className="p-0">
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <p className="text-muted mb-0 mt-2">Loading history...</p>
          </div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-4">
            <IconifyIcon icon="bx:info-circle" className="text-muted fs-2 mb-2" />
            <p className="text-muted mb-0">No history events available</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {events.map(event => (
              <CaseTimelineEvent key={event.id} event={event} />
            ))}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  )
}

export default CaseTimeline

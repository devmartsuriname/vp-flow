import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import type { CaseWithAppointment, CaseStatus } from '../types'

type CaseActionsProps = {
  caseItem: CaseWithAppointment
  userRole: VPFlowRole | null
  onOpen?: () => void
  onStartWork?: () => void
  onPark?: () => void
  onResume?: () => void
  onClose?: () => void
  isUpdating?: boolean
}

export default function CaseActions({
  caseItem,
  userRole,
  onOpen,
  onStartWork,
  onPark,
  onResume,
  onClose,
  isUpdating,
}: CaseActionsProps) {
  const status = caseItem.status
  const isClosed = status === 'closed'

  // Only VP can perform actions
  if (!isVP(userRole) || isClosed) {
    return null
  }

  const canOpen = status === 'draft'
  const canStartWork = status === 'open'
  const canPark = status === 'open' || status === 'in_progress'
  const canResume = status === 'parked'
  const canClose = status !== 'draft'

  return (
    <div className="d-flex flex-wrap gap-2">
      <Link to={`/cases/${caseItem.id}/edit`} className="btn btn-outline-primary">
        <IconifyIcon icon="bx:edit" className="me-1" />
        Edit
      </Link>

      {canOpen && onOpen && (
        <Button variant="primary" onClick={onOpen} disabled={isUpdating}>
          <IconifyIcon icon="bx:folder-open" className="me-1" />
          Open Case
        </Button>
      )}

      {canStartWork && onStartWork && (
        <Button variant="info" onClick={onStartWork} disabled={isUpdating}>
          <IconifyIcon icon="bx:play" className="me-1" />
          Start Work
        </Button>
      )}

      {canPark && onPark && (
        <Button variant="warning" onClick={onPark} disabled={isUpdating}>
          <IconifyIcon icon="bx:pause" className="me-1" />
          Park
        </Button>
      )}

      {canResume && onResume && (
        <Button variant="primary" onClick={onResume} disabled={isUpdating}>
          <IconifyIcon icon="bx:play" className="me-1" />
          Resume
        </Button>
      )}

      {canClose && onClose && (
        <Button variant="success" onClick={onClose} disabled={isUpdating}>
          <IconifyIcon icon="bx:check-circle" className="me-1" />
          Close Case
        </Button>
      )}
    </div>
  )
}

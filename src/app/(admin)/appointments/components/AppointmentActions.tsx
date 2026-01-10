import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { isVP, isSecretary } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import type { AppointmentWithClient } from '../types'

type AppointmentActionsProps = {
  appointment: AppointmentWithClient
  userRole: VPFlowRole | null
  currentUserId?: string
  onSubmit?: () => void
  onApprove?: () => void
  onReject?: () => void
  onCancel?: () => void
  onComplete?: () => void
  isSubmitting?: boolean
  isApproving?: boolean
  isRejecting?: boolean
  isCancelling?: boolean
  isCompleting?: boolean
}

export default function AppointmentActions({
  appointment,
  userRole,
  currentUserId,
  onSubmit,
  onApprove,
  onReject,
  onCancel,
  onComplete,
  isSubmitting,
  isApproving,
  isRejecting,
  isCancelling,
  isCompleting,
}: AppointmentActionsProps) {
  const status = appointment.status
  const isCreator = appointment.created_by === currentUserId

  // Determine which actions to show based on role and status
  const canEdit = 
    (isVP(userRole) && !['rejected', 'cancelled', 'completed'].includes(status)) ||
    (isSecretary(userRole) && status === 'draft' && isCreator)

  const canSubmit = 
    (isVP(userRole) || (isSecretary(userRole) && isCreator)) && 
    status === 'draft'

  const canApprove = isVP(userRole) && status === 'pending_vp'
  const canReject = isVP(userRole) && status === 'pending_vp'
  const canCancel = isVP(userRole) && ['approved', 'rescheduled'].includes(status)
  const canComplete = isVP(userRole) && ['approved', 'rescheduled'].includes(status)

  const hasAnyAction = canEdit || canSubmit || canApprove || canReject || canCancel || canComplete

  if (!hasAnyAction) {
    return null
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {/* Edit Button */}
      {canEdit && (
        <Link
          to={`/appointments/${appointment.id}/edit`}
          className="btn btn-outline-primary"
        >
          <IconifyIcon icon="bx:edit" className="me-1" />
          Edit
        </Link>
      )}

      {/* Submit for Approval */}
      {canSubmit && onSubmit && (
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Submitting...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:send" className="me-1" />
              Submit for Approval
            </>
          )}
        </Button>
      )}

      {/* Approve Button (VP only) */}
      {canApprove && onApprove && (
        <Button
          variant="success"
          onClick={onApprove}
          disabled={isApproving}
        >
          {isApproving ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Approving...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:check" className="me-1" />
              Approve
            </>
          )}
        </Button>
      )}

      {/* Reject Button (VP only) */}
      {canReject && onReject && (
        <Button
          variant="danger"
          onClick={onReject}
          disabled={isRejecting}
        >
          {isRejecting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Rejecting...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:x" className="me-1" />
              Reject
            </>
          )}
        </Button>
      )}

      {/* Complete Button (VP only) */}
      {canComplete && onComplete && (
        <Button
          variant="primary"
          onClick={onComplete}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Completing...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:check-double" className="me-1" />
              Mark Complete
            </>
          )}
        </Button>
      )}

      {/* Cancel Button (VP only) */}
      {canCancel && onCancel && (
        <Button
          variant="outline-danger"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Cancelling...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:x-circle" className="me-1" />
              Cancel
            </>
          )}
        </Button>
      )}
    </div>
  )
}

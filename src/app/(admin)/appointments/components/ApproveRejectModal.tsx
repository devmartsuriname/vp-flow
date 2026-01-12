import { useState } from 'react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type ApproveRejectModalProps = {
  show: boolean
  mode: 'approve' | 'reject'
  isLoading: boolean
  onConfirm: (reason?: string) => void
  onCancel: () => void
}

export default function ApproveRejectModal({
  show,
  mode,
  isLoading,
  onConfirm,
  onCancel,
}: ApproveRejectModalProps) {
  const [reason, setReason] = useState('')

  const isApprove = mode === 'approve'
  const title = isApprove ? 'Approve Appointment' : 'Reject Appointment'
  const confirmText = isApprove ? 'Approve' : 'Reject'
  const confirmVariant = isApprove ? 'success' : 'danger'

  const handleConfirm = () => {
    if (isApprove) {
      onConfirm()
    } else {
      onConfirm(reason)
    }
    setReason('')
  }

  const handleClose = () => {
    setReason('')
    onCancel()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isApprove ? (
          <p>Are you sure you want to approve this appointment?</p>
        ) : (
          <>
            <p>Please provide a reason for rejecting this appointment:</p>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading || (!isApprove && !reason.trim())}
        >
          {isLoading ? (
            <>
            <Spinner animation="border" size="sm" className="me-1" />
            {isApprove ? 'Approving...' : 'Rejecting...'}
            </>
          ) : (
            <>
              <IconifyIcon icon={isApprove ? 'bx:check' : 'bx:x'} className="me-1" />
              {confirmText}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

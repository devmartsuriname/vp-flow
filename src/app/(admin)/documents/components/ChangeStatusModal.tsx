import { Modal, Button, Form } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { STATUS_CONFIG, STATUS_TRANSITIONS, type Document, type DocumentStatus } from '../types'
import DocumentStatusBadge from './DocumentStatusBadge'

type ChangeStatusModalProps = {
  show: boolean
  onHide: () => void
  document: Document | null
  onConfirm: (newStatus: DocumentStatus) => void
  isLoading: boolean
  isVP: boolean
}

export default function ChangeStatusModal({
  show,
  onHide,
  document,
  onConfirm,
  isLoading,
  isVP,
}: ChangeStatusModalProps) {
  if (!document) return null

  const currentStatus = document.status as DocumentStatus
  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || []
  
  // Secretary can only do draft -> final
  // VP can do all transitions
  const allowedTransitions = isVP 
    ? availableTransitions 
    : availableTransitions.filter((s) => s === 'final' && currentStatus === 'draft')

  const handleStatusChange = (status: DocumentStatus) => {
    onConfirm(status)
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:transfer" className="me-2" />
          Change Document Status
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <strong>Document:</strong> {document.title || document.file_name}
        </div>
        
        <div className="mb-3">
          <strong>Current Status:</strong>{' '}
          <DocumentStatusBadge status={currentStatus} />
        </div>

        {allowedTransitions.length === 0 ? (
          <div className="alert alert-warning mb-0">
            <IconifyIcon icon="bx:info-circle" className="me-2" />
            {currentStatus === 'archived' 
              ? 'Archived documents cannot have their status changed.'
              : isVP 
                ? 'No status transitions available for this document.'
                : 'You do not have permission to change this document\'s status.'}
          </div>
        ) : (
          <>
            <p className="text-muted">Select a new status:</p>
            <div className="d-grid gap-2">
              {allowedTransitions.map((status) => {
                const config = STATUS_CONFIG[status]
                return (
                  <Button
                    key={status}
                    variant={`outline-${config.variant}`}
                    onClick={() => handleStatusChange(status)}
                    disabled={isLoading}
                    className="text-start"
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <IconifyIcon icon={config.icon} className="me-2" />
                    )}
                    Mark as {config.label}
                  </Button>
                )
              })}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

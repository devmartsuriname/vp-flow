import { Modal, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type DeactivateModalProps = {
  show: boolean
  onHide: () => void
  onConfirm: () => void
  isLoading: boolean
  documentTitle: string
}

export default function DeactivateModal({
  show,
  onHide,
  onConfirm,
  isLoading,
  documentTitle,
}: DeactivateModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:trash" className="me-2 text-danger" />
          Deactivate Document
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-warning d-flex align-items-start gap-2">
          <IconifyIcon icon="bx:info-circle" className="fs-5 mt-1" />
          <div>
            <strong>This action will deactivate the document.</strong>
            <p className="mb-0 mt-1 small">
              The document will be hidden from normal views but retained for audit purposes.
              This action is logged and cannot be undone.
            </p>
          </div>
        </div>
        <p className="mb-0">
          Document: <strong>{documentTitle}</strong>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Deactivating...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:trash" className="me-1" />
              Deactivate
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

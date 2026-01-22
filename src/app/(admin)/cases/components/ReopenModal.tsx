import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type ReopenModalProps = {
  show: boolean
  onHide: () => void
  onConfirm: (justification: string) => void
  isLoading: boolean
  caseTitle: string
}

export default function ReopenModal({
  show,
  onHide,
  onConfirm,
  isLoading,
  caseTitle,
}: ReopenModalProps) {
  const [justification, setJustification] = useState('')

  const handleConfirm = () => {
    onConfirm(justification)
    setJustification('')
  }

  const handleHide = () => {
    setJustification('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:folder-open" className="me-2 text-warning" />
          Re-open Case
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-warning d-flex align-items-start gap-2">
          <IconifyIcon icon="bx:info-circle" className="fs-5 mt-1" />
          <div>
            <strong>This action will re-open a closed case.</strong>
            <p className="mb-0 mt-1 small">
              Re-opening allows further edits to the case. Once changes are complete, 
              the case must be closed again to finalize.
            </p>
          </div>
        </div>
        <p className="mb-3">
          You are about to re-open: <strong>{caseTitle}</strong>
        </p>
        <Form.Group className="mb-3">
          <Form.Label>Justification (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Enter reason for re-opening this case..."
            disabled={isLoading}
          />
          <Form.Text className="text-muted">
            This will be recorded in the audit log.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Re-opening...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:folder-open" className="me-1" />
              Re-open Case
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

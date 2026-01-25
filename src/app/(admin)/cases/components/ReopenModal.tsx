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

const MIN_CHARS = 10

export default function ReopenModal({
  show,
  onHide,
  onConfirm,
  isLoading,
  caseTitle,
}: ReopenModalProps) {
  const [justification, setJustification] = useState('')

  const trimmedLength = justification.trim().length
  const isValid = trimmedLength >= MIN_CHARS
  const showError = justification.length > 0 && !isValid

  const handleConfirm = () => {
    if (!isValid) return
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
          <Form.Label>
            Justification <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Enter reason for re-opening this case (minimum 10 characters)..."
            disabled={isLoading}
            className={showError ? 'is-invalid' : ''}
          />
          {showError && (
            <div className="invalid-feedback d-block">
              Minimum {MIN_CHARS} characters required
            </div>
          )}
          <Form.Text className={isValid ? 'text-success' : 'text-muted'}>
            {trimmedLength}/{MIN_CHARS} characters (required)
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleConfirm} disabled={isLoading || !isValid}>
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

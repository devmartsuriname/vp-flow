import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

type CloseModalProps = {
  show: boolean
  onHide: () => void
  onConfirm: (resolutionSummary: string) => void
  isLoading?: boolean
  caseTitle?: string
}

export default function CloseModal({
  show,
  onHide,
  onConfirm,
  isLoading,
  caseTitle,
}: CloseModalProps) {
  const [resolutionSummary, setResolutionSummary] = useState('')

  const handleConfirm = () => {
    onConfirm(resolutionSummary)
  }

  const handleHide = () => {
    setResolutionSummary('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Close Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          You are about to close{' '}
          <strong>{caseTitle || 'this case'}</strong>.
        </p>
        <p className="text-warning mb-3">
          <strong>Warning:</strong> Once closed, this case cannot be reopened or edited.
        </p>
        <Form.Group>
          <Form.Label>Resolution Summary (Required)</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={resolutionSummary}
            onChange={(e) => setResolutionSummary(e.target.value)}
            placeholder="Describe how this case was resolved..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={isLoading || !resolutionSummary.trim()}
        >
          {isLoading ? 'Closing...' : 'Close Case'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

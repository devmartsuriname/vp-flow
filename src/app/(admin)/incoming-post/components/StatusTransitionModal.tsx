import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import type { IncomingPostStatus } from '../types'
import { STATUS_LABELS } from '../constants'

type Props = {
  show: boolean
  onHide: () => void
  onConfirm: (extras: {
    advice_request?: string
    advice_response?: string
    forwarding_destination?: string
    rejection_reason?: string
  }) => void
  isLoading: boolean
  targetStatus: IncomingPostStatus
  referenceNumber: string
}

export default function StatusTransitionModal({
  show, onHide, onConfirm, isLoading, targetStatus, referenceNumber,
}: Props) {
  const [adviceRequest, setAdviceRequest] = useState('')
  const [adviceResponse, setAdviceResponse] = useState('')
  const [forwardingDest, setForwardingDest] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const handleConfirm = () => {
    const extras: Record<string, string> = {}
    if (targetStatus === 'waiting_advice' && adviceRequest.trim()) {
      extras.advice_request = adviceRequest.trim()
    }
    if (targetStatus === 'advice_received' && adviceResponse.trim()) {
      extras.advice_response = adviceResponse.trim()
    }
    if (targetStatus === 'forwarded' && forwardingDest.trim()) {
      extras.forwarding_destination = forwardingDest.trim()
    }
    if (targetStatus === 'rejected' && rejectionReason.trim()) {
      extras.rejection_reason = rejectionReason.trim()
    }
    onConfirm(extras)
  }

  const needsInput = ['waiting_advice', 'advice_received', 'forwarded', 'rejected'].includes(targetStatus)
  const isValid = !needsInput || (
    (targetStatus === 'waiting_advice' && adviceRequest.trim().length >= 5) ||
    (targetStatus === 'advice_received' && adviceResponse.trim().length >= 5) ||
    (targetStatus === 'forwarded' && forwardingDest.trim().length >= 2) ||
    (targetStatus === 'rejected' && rejectionReason.trim().length >= 5) ||
    !['waiting_advice', 'advice_received', 'forwarded', 'rejected'].includes(targetStatus)
  )

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm: {STATUS_LABELS[targetStatus]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Change <strong>{referenceNumber}</strong> to{' '}
          <strong>{STATUS_LABELS[targetStatus]}</strong>?
        </p>

        {targetStatus === 'waiting_advice' && (
          <Form.Group>
            <Form.Label>What advice is needed? <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adviceRequest}
              onChange={(e) => setAdviceRequest(e.target.value)}
              placeholder="Describe what advice is requested..."
            />
          </Form.Group>
        )}

        {targetStatus === 'advice_received' && (
          <Form.Group>
            <Form.Label>Advice Response <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adviceResponse}
              onChange={(e) => setAdviceResponse(e.target.value)}
              placeholder="Enter the advice response..."
            />
          </Form.Group>
        )}

        {targetStatus === 'forwarded' && (
          <Form.Group>
            <Form.Label>Forwarding Destination <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={forwardingDest}
              onChange={(e) => setForwardingDest(e.target.value)}
              placeholder="Where to forward..."
            />
          </Form.Group>
        )}

        {targetStatus === 'rejected' && (
          <Form.Group>
            <Form.Label>Rejection Reason <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
            />
          </Form.Group>
        )}

        {targetStatus === 'archived' && (
          <div className="alert alert-warning mb-0 mt-2">
            <strong>Warning:</strong> Archiving is permanent and irreversible. 
            No further modifications will be possible.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={isLoading}>Cancel</Button>
        <Button
          variant={targetStatus === 'rejected' ? 'danger' : targetStatus === 'archived' ? 'warning' : 'primary'}
          onClick={handleConfirm}
          disabled={isLoading || !isValid}
        >
          {isLoading ? 'Processing...' : `Confirm ${STATUS_LABELS[targetStatus]}`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

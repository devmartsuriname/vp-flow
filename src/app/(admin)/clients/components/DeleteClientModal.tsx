import { Modal, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { Client } from '../types'
import { getClientDisplayName } from '../types'

type DeleteClientModalProps = {
  show: boolean
  client: Client | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteClientModal({
  show,
  client,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteClientModalProps) {
  if (!client) return null

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:error-circle" className="text-danger me-2" />
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">
          Are you sure you want to delete the client{' '}
          <strong>{getClientDisplayName(client)}</strong>?
        </p>
        <p className="text-muted small mt-2 mb-0">
          This action cannot be undone. Any associated appointments may also be affected.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Deleting...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:trash" className="me-1" />
              Delete
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

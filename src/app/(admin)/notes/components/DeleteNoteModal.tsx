import { Modal, Button, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type DeleteNoteModalProps = {
  show: boolean
  onHide: () => void
  onConfirm: () => void
  isLoading: boolean
  noteTitle: string
}

export default function DeleteNoteModal({
  show,
  onHide,
  onConfirm,
  isLoading,
  noteTitle,
}: DeleteNoteModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:trash" className="text-danger me-2" />
          Delete Note
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">
          Are you sure you want to delete the note <strong>"{noteTitle}"</strong>?
        </p>
        <p className="text-muted mb-0 mt-2">
          This action cannot be undone. The note will be permanently removed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Deleting...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:trash" className="me-2" />
              Delete Note
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useNotes, useDeleteNote } from './hooks'
import { NotesTable, DeleteNoteModal } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import type { NoteWithLink } from './types'
import { getNoteDisplayTitle } from './types'

const NotesPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: notes = [], isLoading, error } = useNotes()
  const deleteMutation = useDeleteNote()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteWithLink | null>(null)

  // VP-only access - redirect non-VP users
  useEffect(() => {
    if (!authLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  // Don't render if not VP
  if (!authLoading && !isVP(role)) return null

  const handleDeleteClick = (note: NoteWithLink) => {
    setSelectedNote(note)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (!selectedNote) return
    deleteMutation.mutate(selectedNote.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        setSelectedNote(null)
      },
    })
  }

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Notes" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Notes</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle subName="VP-Flow" title="Notes" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">VP Notes</h5>
              <p className="text-muted mb-0">Personal notes for the Vice President</p>
            </div>
            <Link to="/notes/create" className="btn btn-primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              New Note
            </Link>
          </div>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <NotesTable
            notes={notes}
            isLoading={isLoading}
            onDelete={handleDeleteClick}
          />
        </CardBody>
      </Card>

      {/* Delete Modal */}
      <DeleteNoteModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setSelectedNote(null)
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        noteTitle={selectedNote ? getNoteDisplayTitle(selectedNote) : ''}
      />
    </>
  )
}

export default NotesPage

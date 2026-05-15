import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Row, Col, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useNotes, useDeleteNote, NOTES_PAGE_SIZE } from './hooks'
import { NotesTable, DeleteNoteModal } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import type { NoteWithLink } from './types'
import { getNoteDisplayTitle } from './types'

const NotesPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useNotes(page)
  const deleteMutation = useDeleteNote()

  const notes = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / NOTES_PAGE_SIZE))

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteWithLink | null>(null)

  // VP-only access — wait for role to be resolved (not just authLoading) to avoid
  // race condition on direct URL navigation where AuthContext sets isLoading=false
  // before role is fetched.
  useEffect(() => {
    if (!authLoading && role !== null && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  // Don't render content for non-VP (redirect pending)
  if (!authLoading && role !== null && !isVP(role)) return null

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

  const from = totalCount === 0 ? 0 : (page - 1) * NOTES_PAGE_SIZE + 1
  const to = Math.min(page * NOTES_PAGE_SIZE, totalCount)

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
        {totalCount > 0 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <small className="text-muted">Showing {from}–{to} of {totalCount}</small>
            {totalPages > 1 && (
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Page {page} of {totalPages}</small>
                <Pagination className="mb-0">
                  <Pagination.Prev
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                  <Pagination.Next
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </Pagination>
              </div>
            )}
          </div>
        )}
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

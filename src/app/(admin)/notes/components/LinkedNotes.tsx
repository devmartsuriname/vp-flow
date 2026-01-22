import { useState, useEffect } from 'react'
import { Card, Button, Spinner, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import type { NoteEntityType, Note } from '../types'
import { getNoteDisplayTitle } from '../types'
import DeleteNoteModal from './DeleteNoteModal'
import { useDeleteNote } from '../hooks'

type LinkedNotesProps = {
  entityType: NoteEntityType
  entityId: string
  entityName: string
  userRole: VPFlowRole | null
  readOnly?: boolean
}

type LinkedNote = Note & {
  link_id: string
}

export default function LinkedNotes({
  entityType,
  entityId,
  entityName,
  userRole,
  readOnly = false,
}: LinkedNotesProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<LinkedNote | null>(null)
  const deleteMutation = useDeleteNote()

  // Only VP can see notes
  if (!isVP(userRole)) {
    return null
  }

  // Fetch notes linked to this entity
  const { data: notes = [], isLoading, isError, refetch } = useQuery<LinkedNote[], Error>({
    queryKey: ['linked-notes', entityType, entityId],
    queryFn: async () => {
      // First get note_links for this entity
      const { data: links, error: linksError } = await supabase
        .from('note_links')
        .select('id, note_id')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)

      if (linksError) {
        throw new Error(linksError.message)
      }

      if (!links || links.length === 0) {
        return []
      }

      // Then fetch the actual notes
      const noteIds = links.map((l) => l.note_id)
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .in('id', noteIds)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })

      if (notesError) {
        throw new Error(notesError.message)
      }

      // Map notes with their link IDs
      return (notesData || []).map((note) => ({
        ...note,
        link_id: links.find((l) => l.note_id === note.id)?.id || '',
      }))
    },
  })

  const handleDelete = () => {
    if (!selectedNote) return
    deleteMutation.mutate(selectedNote.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        setSelectedNote(null)
        refetch()
      },
    })
  }

  const openDeleteModal = (note: LinkedNote) => {
    setSelectedNote(note)
    setShowDeleteModal(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="bx:notepad" className="me-2" />
            VP Notes
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading notes...
        </Card.Body>
      </Card>
    )
  }

  // Error state
  if (isError) {
    return (
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="bx:notepad" className="me-2" />
            VP Notes
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-danger mb-0">Failed to load notes.</p>
        </Card.Body>
      </Card>
    )
  }

  // Build create link URL with prefilled entity
  const createUrl = `/notes/create?linkType=${entityType}&linkId=${entityId}`

  return (
    <>
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="bx:notepad" className="me-2" />
            VP Notes
            {notes.length > 0 && (
              <span className="badge bg-secondary ms-2">{notes.length}</span>
            )}
          </h5>
          {!readOnly && (
            <Link to={createUrl} className="btn btn-primary btn-sm">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Note
            </Link>
          )}
        </Card.Header>
        <Card.Body>
          {notes.length === 0 ? (
            <p className="text-muted mb-0">No notes linked to this {entityType}.</p>
          ) : (
            <Row className="g-3">
              {notes.map((note) => (
                <Col key={note.id} xs={12}>
                  <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                    <div className="d-flex align-items-center gap-3">
                      <IconifyIcon icon="bx:notepad" className="fs-4 text-primary" />
                      <div>
                        <Link to={`/notes/${note.id}`} className="fw-medium text-decoration-none">
                          {getNoteDisplayTitle(note)}
                        </Link>
                        <small className="text-muted d-block">
                          Updated: {format(new Date(note.updated_at), 'PP')}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <Link
                        to={`/notes/${note.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="View"
                      >
                        <IconifyIcon icon="bx:show" />
                      </Link>
                      {!readOnly && (
                        <>
                          <Link
                            to={`/notes/${note.id}/edit`}
                            className="btn btn-outline-secondary btn-sm"
                            title="Edit"
                          >
                            <IconifyIcon icon="bx:edit" />
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => openDeleteModal(note)}
                            title="Delete"
                          >
                            <IconifyIcon icon="bx:trash" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <DeleteNoteModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setSelectedNote(null)
        }}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        noteTitle={selectedNote ? getNoteDisplayTitle(selectedNote) : ''}
      />
    </>
  )
}

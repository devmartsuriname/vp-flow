import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Row, Col, Card, CardBody, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { NoteForm } from '../../components'
import { useNote, useUpdateNote, useLinkNote, useUnlinkNote } from '../../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import type { NoteFormData, NoteLink, NoteEntityType } from '../../types'
import { getNoteDisplayTitle } from '../../types'
import { toast } from 'react-toastify'

// Helper to get first link
function getFirstLink(noteLinks: NoteLink | NoteLink[] | null): NoteLink | null {
  if (!noteLinks) return null
  if (Array.isArray(noteLinks)) {
    return noteLinks.length > 0 ? noteLinks[0] : null
  }
  return noteLinks
}

const NoteEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: note, isLoading, error } = useNote(id)
  const updateMutation = useUpdateNote()
  const linkMutation = useLinkNote()
  const unlinkMutation = useUnlinkNote()

  // VP-only access
  useEffect(() => {
    if (!authLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !isVP(role)) return null

  const handleSubmit = async (data: NoteFormData) => {
    if (!id) return

    try {
      // Update note content
      await updateMutation.mutateAsync({
        id,
        data: {
          title: data.title,
          content: data.content,
        },
      })

      // Handle link changes
      const currentLink = note ? getFirstLink(note.note_links) : null
      const hasCurrentLink = !!currentLink
      const wantsLink = !!(data.entityType && data.entityId)

      if (hasCurrentLink && !wantsLink) {
        // Remove existing link
        await unlinkMutation.mutateAsync(id)
      } else if (wantsLink) {
        // Check if link is different
        const linkChanged = !currentLink ||
          currentLink.entity_type !== data.entityType ||
          currentLink.entity_id !== data.entityId

        if (linkChanged) {
          // Remove old link if exists
          if (hasCurrentLink) {
            await unlinkMutation.mutateAsync(id)
          }
          // Add new link
          await linkMutation.mutateAsync({
            noteId: id,
            entityType: data.entityType!,
            entityId: data.entityId!,
          })
        }
      }

      toast.success('Note updated successfully')
      navigate(`/notes/${id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update note')
    }
  }

  if (isLoading || authLoading) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Edit Note" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" />
          </CardBody>
        </Card>
      </>
    )
  }

  if (error || !note) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Edit Note" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Note Not Found</h5>
            <p className="text-muted">{error?.message || 'The requested note could not be found.'}</p>
            <Link to="/notes" className="btn btn-primary">
              Back to Notes
            </Link>
          </CardBody>
        </Card>
      </>
    )
  }

  const currentLink = getFirstLink(note.note_links)

  return (
    <>
      <PageTitle subName="VP-Flow" title={`Edit: ${getNoteDisplayTitle(note)}`} />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/notes/${id}`} className="btn btn-link text-muted p-0 mb-1">
                <IconifyIcon icon="bx:arrow-back" className="me-1" />
                Back to Note
              </Link>
              <h5 className="mb-0">Edit Note</h5>
            </div>
          </div>
        </Col>
      </Row>
      <NoteForm
        initialData={{
          title: note.title || '',
          content: note.content,
          entityType: currentLink?.entity_type as NoteEntityType | undefined,
          entityId: currentLink?.entity_id,
        }}
        onSubmit={handleSubmit}
        isLoading={
          updateMutation.isPending ||
          linkMutation.isPending ||
          unlinkMutation.isPending
        }
        submitLabel="Save Changes"
      />
    </>
  )
}

export default NoteEditPage

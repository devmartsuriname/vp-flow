import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { NoteForm } from '../components'
import { useCreateNote, useLinkNote } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import type { NoteFormData, NoteEntityType } from '../types'
import { toast } from 'react-toastify'

const NoteCreatePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { role, isLoading: authLoading } = useAuthContext()
  const createMutation = useCreateNote()
  const linkMutation = useLinkNote()

  // Get prefilled entity from URL params (when creating from entity detail page)
  const prefilledEntityType = searchParams.get('linkType') as NoteEntityType | null
  const prefilledEntityId = searchParams.get('linkId')

  // VP-only access
  useEffect(() => {
    if (!authLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !isVP(role)) return null

  const handleSubmit = async (data: NoteFormData) => {
    try {
      // Create the note first
      const note = await createMutation.mutateAsync({
        title: data.title,
        content: data.content,
      })

      // If entity is selected, create the link
      if (data.entityType && data.entityId) {
        await linkMutation.mutateAsync({
          noteId: note.id,
          entityType: data.entityType,
          entityId: data.entityId,
        })
      }

      toast.success('Note created successfully')
      navigate(`/notes/${note.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create note')
    }
  }

  return (
    <>
      <PageTitle subName="VP-Flow" title="Create Note" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to="/notes" className="btn btn-link text-muted p-0 mb-1">
                <IconifyIcon icon="bx:arrow-back" className="me-1" />
                Back to Notes
              </Link>
              <h5 className="mb-0">Create New Note</h5>
            </div>
          </div>
        </Col>
      </Row>
      <NoteForm
        initialData={{
          title: '',
          content: '',
          entityType: prefilledEntityType,
          entityId: prefilledEntityId,
        }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || linkMutation.isPending}
        submitLabel="Create Note"
      />
    </>
  )
}

export default NoteCreatePage

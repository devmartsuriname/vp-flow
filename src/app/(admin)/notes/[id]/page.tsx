import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Row, Col, Card, CardBody, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { NoteDetail, DeleteNoteModal } from '../components'
import { useNote, useDeleteNote } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import { getNoteDisplayTitle } from '../types'
import { toast } from 'react-toastify'

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: note, isLoading, error } = useNote(id)
  const deleteMutation = useDeleteNote()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // VP-only access
  useEffect(() => {
    if (!authLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !isVP(role)) return null

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Note deleted successfully')
        navigate('/notes')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (isLoading || authLoading) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Note" />
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
        <PageTitle subName="VP-Flow" title="Note" />
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

  return (
    <>
      <PageTitle subName="VP-Flow" title={getNoteDisplayTitle(note)} />
      <Row className="mb-3">
        <Col>
          <Link to="/notes" className="btn btn-link text-muted p-0">
            <IconifyIcon icon="bx:arrow-back" className="me-1" />
            Back to Notes
          </Link>
        </Col>
      </Row>
      <NoteDetail
        note={note}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Delete Modal */}
      <DeleteNoteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        noteTitle={getNoteDisplayTitle(note)}
      />
    </>
  )
}

export default NoteDetailPage

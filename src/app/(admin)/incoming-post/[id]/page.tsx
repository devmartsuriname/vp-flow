import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useIncomingPost, useUpdateIncomingPostStatus } from '../hooks'
import { IncomingPostDetail, StatusTransitionModal } from '../components'
import { useAuthContext } from '@/context/useAuthContext'
import type { IncomingPostStatus } from '../types'

const IncomingPostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role } = useAuthContext()
  const { data: post, isLoading, error } = useIncomingPost(id)
  const updateStatus = useUpdateIncomingPostStatus()

  const [modalTarget, setModalTarget] = useState<IncomingPostStatus | null>(null)

  if (isLoading) {
    return (
      <>
        <PageTitle subName="Incoming Post" title="Post Details" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <PageTitle subName="Incoming Post" title="Not Found" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Post Not Found</h5>
            <Button variant="primary" onClick={() => navigate('/incoming-post')}>
              Back to Incoming Post
            </Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const handleStatusAction = (targetStatus: IncomingPostStatus) => {
    setModalTarget(targetStatus)
  }

  const handleConfirm = (extras: Record<string, string>) => {
    if (!modalTarget) return
    updateStatus.mutate(
      { id: post.id, status: modalTarget, ...extras },
      { onSuccess: () => setModalTarget(null) },
    )
  }

  return (
    <>
      <PageTitle subName="Incoming Post" title="Post Details" />
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate('/incoming-post')}>
          <IconifyIcon icon="bx:arrow-back" className="me-1" />
          Back to Incoming Post
        </Button>
      </div>
      <IncomingPostDetail
        post={post}
        userRole={role}
        onStatusAction={handleStatusAction}
        isUpdating={updateStatus.isPending}
      />
      {modalTarget && (
        <StatusTransitionModal
          show={!!modalTarget}
          onHide={() => setModalTarget(null)}
          onConfirm={handleConfirm}
          isLoading={updateStatus.isPending}
          targetStatus={modalTarget}
          referenceNumber={post.reference_number}
        />
      )}
    </>
  )
}

export default IncomingPostDetailPage

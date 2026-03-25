import { useEffect } from 'react'
import { Card, CardBody, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useIncomingPosts } from './hooks'
import { IncomingPostTable } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isProtocol, isVPOrSecretary } from '@/hooks/useUserRole'

const IncomingPostPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: posts = [], isLoading, error } = useIncomingPosts(role)

  useEffect(() => {
    if (!authLoading && isProtocol(role)) {
      // Protocol can only see forwarded invitations — let them through
      // The query will filter appropriately via RLS
    }
  }, [role, authLoading, navigate])

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Incoming Post" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Incoming Post</h5>
            <p className="text-muted">{error.message}</p>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle subName="VP-Flow" title="Incoming Post" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Incoming Post Management</h5>
              <p className="text-muted mb-0">Register and process incoming correspondence</p>
            </div>
            {isVPOrSecretary(role) && (
              <Link to="/incoming-post/create" className="btn btn-primary">
                <IconifyIcon icon="bx:plus" className="me-1" />
                Register Post
              </Link>
            )}
          </div>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <IncomingPostTable posts={posts} isLoading={isLoading} />
        </CardBody>
      </Card>
    </>
  )
}

export default IncomingPostPage

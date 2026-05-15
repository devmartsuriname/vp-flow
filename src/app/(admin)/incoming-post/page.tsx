import { useState } from 'react'
import { Card, CardBody, Row, Col, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useIncomingPosts, INCOMING_POST_PAGE_SIZE } from './hooks'
import { IncomingPostTable } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary } from '@/hooks/useUserRole'

const IncomingPostPage = () => {
  const { role } = useAuthContext()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useIncomingPosts(role, page)

  const posts = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / INCOMING_POST_PAGE_SIZE))

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

  const from = totalCount === 0 ? 0 : (page - 1) * INCOMING_POST_PAGE_SIZE + 1
  const to = Math.min(page * INCOMING_POST_PAGE_SIZE, totalCount)

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
    </>
  )
}

export default IncomingPostPage

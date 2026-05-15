import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Row, Col, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCases, CASES_PAGE_SIZE } from './hooks'
import { CasesTable } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP, isProtocol } from '@/hooks/useUserRole'

const CasesPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useCases(role, page)

  const cases = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / CASES_PAGE_SIZE))

  useEffect(() => {
    if (!authLoading && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && isProtocol(role)) return null

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Cases" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Cases</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const from = totalCount === 0 ? 0 : (page - 1) * CASES_PAGE_SIZE + 1
  const to = Math.min(page * CASES_PAGE_SIZE, totalCount)

  return (
    <>
      <PageTitle subName="VP-Flow" title="Cases" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Case Management</h5>
              <p className="text-muted mb-0">Track and manage cases derived from appointments</p>
            </div>
            {isVP(role) && (
              <Link to="/cases/create" className="btn btn-primary">
                <IconifyIcon icon="bx:plus" className="me-1" />
                New Case
              </Link>
            )}
          </div>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <CasesTable cases={cases} isLoading={isLoading} userRole={role} />
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

export default CasesPage

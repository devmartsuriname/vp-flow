import { useEffect } from 'react'
import { Card, CardBody, Button, Row, Col, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCases } from './hooks'
import { CasesTable } from './components'
import { useUserRole, isVP, isProtocol } from '@/hooks/useUserRole'

const CasesPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: cases = [], isLoading, error } = useCases()

  useEffect(() => {
    if (!isRoleLoading && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, isRoleLoading, navigate])

  if (isRoleLoading) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Cases" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (isProtocol(role)) return null

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
      </Card>
    </>
  )
}

export default CasesPage

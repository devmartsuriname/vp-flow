import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Row, Col, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAppointments, APPOINTMENTS_PAGE_SIZE } from './hooks'
import { AppointmentsTable } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary } from '@/hooks/useUserRole'

const AppointmentsPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useAppointments(role, page)

  const appointments = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / APPOINTMENTS_PAGE_SIZE))

  useEffect(() => {
    if (!authLoading && !role) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !role) return null

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Appointments" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Appointments</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const from = totalCount === 0 ? 0 : (page - 1) * APPOINTMENTS_PAGE_SIZE + 1
  const to = Math.min(page * APPOINTMENTS_PAGE_SIZE, totalCount)

  return (
    <>
      <PageTitle subName="VP-Flow" title="Appointments" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Appointment Schedule</h5>
              <p className="text-muted mb-0">Manage VP appointments and meetings</p>
            </div>
            {isVPOrSecretary(role) && (
              <Link to="/appointments/create" className="btn btn-primary">
                <IconifyIcon icon="bx:plus" className="me-1" />
                New Appointment
              </Link>
            )}
          </div>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <AppointmentsTable appointments={appointments} isLoading={isLoading} userRole={role} />
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

export default AppointmentsPage

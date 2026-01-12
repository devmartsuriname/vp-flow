import { useEffect } from 'react'
import { Card, CardBody, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAppointments } from './hooks'
import { AppointmentsTable } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary } from '@/hooks/useUserRole'

const AppointmentsPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: appointments = [], isLoading, error } = useAppointments()

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
      </Card>
    </>
  )
}

export default AppointmentsPage

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Spinner } from 'react-bootstrap'
import Footer from '@/components/layout/Footer'
import PageTitle from '@/components/PageTitle'
import { useUserRole, isVP, isProtocol } from '@/hooks/useUserRole'
import { KPICards, RecentAppointments, RecentCases, RecentClients } from './components'

const DashboardPage = () => {
  const { role, isLoading } = useUserRole()
  const navigate = useNavigate()

  // Redirect Protocol users away from dashboard
  useEffect(() => {
    if (!isLoading && isProtocol(role)) {
      navigate('/appointments', { replace: true })
    }
  }, [role, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  // Don't render for Protocol (redirect in useEffect)
  if (isProtocol(role)) {
    return null
  }

  return (
    <>
      <PageTitle subName="VP-Flow" title="Dashboard" />
      
      {/* KPI Cards */}
      <KPICards role={role} />
      
      {/* Recent Activity Widgets */}
      <Row>
        <Col xl={6} className="mb-4">
          <RecentAppointments />
        </Col>
        <Col xl={6} className="mb-4">
          {isVP(role) ? <RecentCases /> : <RecentClients />}
        </Col>
      </Row>
      
      <Footer />
    </>
  )
}

export default DashboardPage

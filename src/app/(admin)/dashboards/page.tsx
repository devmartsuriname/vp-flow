import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Footer from '@/components/layout/Footer'
import PageTitle from '@/components/PageTitle'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP, isProtocol } from '@/hooks/useUserRole'
import { 
  KPICards, 
  RecentAppointments, 
  RecentCases, 
  RecentClients,
  RecentNotes,
  TodayNotes,
} from './components'

const DashboardPage = () => {
  const { role, isLoading: authLoading } = useAuthContext()
  const navigate = useNavigate()

  // Redirect Protocol users away from dashboard
  useEffect(() => {
    if (!authLoading && isProtocol(role)) {
      navigate('/appointments', { replace: true })
    }
  }, [role, authLoading, navigate])

  // Don't render for Protocol (redirect in useEffect)
  if (!authLoading && isProtocol(role)) {
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

      {/* VP-Only Notes Widgets */}
      {isVP(role) && (
        <Row>
          <Col xl={6} className="mb-4">
            <RecentNotes />
          </Col>
          <Col xl={6} className="mb-4">
            <TodayNotes />
          </Col>
        </Row>
      )}
      
      <Footer />
    </>
  )
}

export default DashboardPage

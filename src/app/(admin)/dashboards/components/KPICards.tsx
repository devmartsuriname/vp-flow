import { Row, Col, Spinner } from 'react-bootstrap'
import KPICard from './KPICard'
import { useDashboardStats } from '../hooks'
import type { AppRole, KPICardData } from '../types'
import { isVP } from '@/hooks/useUserRole'

interface KPICardsProps {
  role: AppRole | null
}

const KPICards = ({ role }: KPICardsProps) => {
  const { stats, isLoading } = useDashboardStats(role)

  if (isLoading) {
    return (
      <Row className="mb-4">
        <Col className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    )
  }

  const kpiCards: KPICardData[] = [
    {
      title: 'Total Clients',
      count: stats.totalClients,
      icon: 'bx:group',
      color: 'primary',
      link: '/clients',
    },
    {
      title: 'Open Appointments',
      count: stats.openAppointments,
      icon: 'bx:calendar-check',
      color: 'success',
      link: '/appointments',
    },
  ]

  // Add Active Cases card only for VP
  if (isVP(role)) {
    kpiCards.push({
      title: 'Active Cases',
      count: stats.activeCases,
      icon: 'bx:briefcase',
      color: 'warning',
      link: '/cases',
    })
  }

  // Add Unread Notifications for all roles
  kpiCards.push({
    title: 'Unread Notifications',
    count: stats.unreadNotifications,
    icon: 'bx:bell',
    color: 'info',
    link: '/notifications',
  })

  return (
    <Row className="mb-4">
      {kpiCards.map((card, index) => (
        <Col key={index} xl={3} md={6} className="mb-3">
          <KPICard {...card} />
        </Col>
      ))}
    </Row>
  )
}

export default KPICards

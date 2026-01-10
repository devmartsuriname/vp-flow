import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useUserRole, isVP } from '@/hooks/useUserRole'
import { useAuditLogs } from './hooks'
import { AuditLogFiltersComponent, AuditLogsTable } from './components'
import type { AuditLogFilters } from './types'

const INITIAL_FILTERS: AuditLogFilters = {
  startDate: null,
  endDate: null,
  action: null,
  entityType: null,
}

export default function AuditLogsPage() {
  const navigate = useNavigate()
  const { role, isLoading: roleLoading } = useUserRole()
  const [filters, setFilters] = useState<AuditLogFilters>(INITIAL_FILTERS)
  const { data: events = [], isLoading: eventsLoading } = useAuditLogs(filters)

  // VP-only access: redirect others
  useEffect(() => {
    if (!roleLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, roleLoading, navigate])

  const handleFiltersChange = (newFilters: AuditLogFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Don't render content for non-VP (redirect is happening)
  if (!isVP(role)) {
    return null
  }

  return (
    <>
      <PageTitle title="Audit Logs" subName="VP-Flow" />

      <AuditLogFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <CardTitle className="mb-0">Audit Events</CardTitle>
          <small className="text-muted">{events.length} events (max 100)</small>
        </CardHeader>
        <CardBody className="p-0">
          <AuditLogsTable events={events} isLoading={eventsLoading} />
        </CardBody>
      </Card>
    </>
  )
}

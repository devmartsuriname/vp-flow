import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader, CardTitle, Pagination } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import { useAuditLogs, AUDIT_LOGS_PAGE_SIZE } from './hooks'
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
  const { role, isLoading: authLoading } = useAuthContext()
  const [filters, setFilters] = useState<AuditLogFilters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const { data, isLoading: eventsLoading } = useAuditLogs(role, filters, page)

  const events = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / AUDIT_LOGS_PAGE_SIZE))

  // VP-only access: redirect others.
  // Wait for role to be resolved (not just authLoading) to avoid race condition
  // on direct URL navigation where AuthContext sets isLoading=false before role is fetched.
  useEffect(() => {
    if (!authLoading && role !== null && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  const handleFiltersChange = (newFilters: AuditLogFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
  }

  // Don't render content while role is still resolving or for non-VP (redirect pending)
  if (!authLoading && role !== null && !isVP(role)) {
    return null
  }

  const from = totalCount === 0 ? 0 : (page - 1) * AUDIT_LOGS_PAGE_SIZE + 1
  const to = Math.min(page * AUDIT_LOGS_PAGE_SIZE, totalCount)

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
          <small className="text-muted">
            {totalCount === 0 ? 'No events' : `Showing ${from}–${to} of ${totalCount}`}
          </small>
        </CardHeader>
        <CardBody className="p-0">
          <AuditLogsTable events={events} isLoading={eventsLoading} />
        </CardBody>
        {totalCount > 0 && totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <small className="text-muted">Page {page} of {totalPages}</small>
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={page === 1 || eventsLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <Pagination.Next
                disabled={page >= totalPages || eventsLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </Pagination>
          </div>
        )}
      </Card>
    </>
  )
}

import { useState } from 'react'
import { Card, CardBody, Row, Col, Badge, Pagination } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { NotificationsTable, NotificationFilters, EmptyState } from './components'
import { useNotificationsPaginated, useMarkAsRead, useMarkAllAsRead, useUnreadCount, NOTIFICATIONS_PAGE_SIZE } from './hooks'
import type { NotificationFilterStatus } from './types'

const NotificationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<NotificationFilterStatus>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useNotificationsPaginated({ status: statusFilter }, page)
  const { data: unreadCount = 0 } = useUnreadCount()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / NOTIFICATIONS_PAGE_SIZE))

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    markAsRead.mutate({ id, isRead })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

  const handleStatusChange = (status: NotificationFilterStatus) => {
    setStatusFilter(status)
    setPage(1)
  }

  const from = totalCount === 0 ? 0 : (page - 1) * NOTIFICATIONS_PAGE_SIZE + 1
  const to = Math.min(page * NOTIFICATIONS_PAGE_SIZE, totalCount)

  return (
    <>
      <PageTitle title="Notifications" subName="VP-Flow" />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              {/* Header with stats */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-1">
                    Notifications
                    {unreadCount > 0 && (
                      <Badge bg="primary" className="ms-2">
                        {unreadCount} unread
                      </Badge>
                    )}
                  </h4>
                  <p className="text-muted mb-0">
                    {totalCount === 0
                      ? 'No notifications'
                      : `Showing ${from}–${to} of ${totalCount}`}
                    {statusFilter !== 'all' && ` (${statusFilter})`}
                  </p>
                </div>

                <NotificationFilters
                  status={statusFilter}
                  onStatusChange={handleStatusChange}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  isMarkingAll={markAllAsRead.isPending}
                  hasUnread={unreadCount > 0}
                />
              </div>

              {/* Notifications list or empty state */}
              {!isLoading && notifications.length === 0 ? (
                <EmptyState
                  message={
                    statusFilter === 'all'
                      ? 'No notifications yet'
                      : `No ${statusFilter} notifications`
                  }
                />
              ) : (
                <NotificationsTable
                  notifications={notifications}
                  isLoading={isLoading}
                  onMarkAsRead={handleMarkAsRead}
                  isMarking={markAsRead.isPending}
                />
              )}

              {totalCount > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default NotificationsPage

import { useState } from 'react'
import { Card, CardBody, Row, Col, Badge } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { NotificationsTable, NotificationFilters, EmptyState } from './components'
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from './hooks'
import type { NotificationFilterStatus } from './types'

const NotificationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<NotificationFilterStatus>('all')

  const { data: notifications = [], isLoading } = useNotifications({ status: statusFilter })
  const { data: unreadCount = 0 } = useUnreadCount()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    markAsRead.mutate({ id, isRead })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

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
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    {statusFilter !== 'all' && ` (${statusFilter})`}
                  </p>
                </div>

                <NotificationFilters
                  status={statusFilter}
                  onStatusChange={setStatusFilter}
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default NotificationsPage

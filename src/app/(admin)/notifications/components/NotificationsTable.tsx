import { Table, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import NotificationStatusIndicator from './NotificationStatusIndicator'
import NotificationCategoryBadge from './NotificationCategoryBadge'
import { formatRelativeTime, truncateMessage } from '../constants'
import type { Notification, NotificationCategory } from '../types'

interface NotificationsTableProps {
  notifications: Notification[]
  isLoading: boolean
  onMarkAsRead: (id: string, isRead: boolean) => void
  isMarking: boolean
}

const NotificationsTable = ({
  notifications,
  isLoading,
  onMarkAsRead,
  isMarking,
}: NotificationsTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <Table className="table-centered mb-0">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th style={{ width: 40 }}>Status</th>
            <th style={{ width: 100 }}>Category</th>
            <th>Title</th>
            <th>Message</th>
            <th style={{ width: 150 }}>Time</th>
            <th style={{ width: 120 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id} className={!notification.is_read ? 'table-light' : ''}>
              <td className="align-middle text-center">
                <NotificationStatusIndicator isRead={notification.is_read} />
              </td>
              <td className="align-middle">
                <NotificationCategoryBadge category={notification.category as NotificationCategory | null} />
              </td>
              <td className="align-middle fw-semibold">
                {notification.link ? (
                  <Link to={notification.link} className="text-dark">
                    {notification.title}
                  </Link>
                ) : (
                  notification.title
                )}
              </td>
              <td className="align-middle text-muted">
                {truncateMessage(notification.message, 80)}
              </td>
              <td className="align-middle text-muted small">
                {formatRelativeTime(notification.created_at)}
              </td>
              <td className="align-middle">
                <Button
                  variant={notification.is_read ? 'outline-secondary' : 'outline-primary'}
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id, !notification.is_read)}
                  disabled={isMarking}
                >
                  <IconifyIcon 
                    icon={notification.is_read ? 'bx:envelope' : 'bx:envelope-open'} 
                    className="me-1" 
                  />
                  {notification.is_read ? 'Mark Unread' : 'Mark Read'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default NotificationsTable

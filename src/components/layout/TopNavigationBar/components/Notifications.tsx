import IconifyIcon from '@/components/wrapper/IconifyIcon'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from '@/app/(admin)/notifications/hooks'
import { formatRelativeTime, truncateMessage } from '@/app/(admin)/notifications/constants'
import type { Notification } from '@/app/(admin)/notifications/types'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <DropdownItem 
      className={`py-3 border-bottom text-wrap ${!notification.is_read ? 'bg-light' : ''}`}
      onClick={handleClick}
    >
      <div className="d-flex">
        <div className="flex-shrink-0">
          <div className="avatar-sm me-2">
            <span className={`avatar-title ${!notification.is_read ? 'bg-soft-primary text-primary' : 'bg-soft-secondary text-secondary'} fs-20 rounded-circle`}>
              <IconifyIcon icon="bx:bell" />
            </span>
          </div>
        </div>
        <div className="flex-grow-1">
          <span className="mb-0 fw-semibold d-block">{notification.title}</span>
          <span className="mb-0 text-muted small">{truncateMessage(notification.message, 50)}</span>
          <span className="d-block text-muted small mt-1">{formatRelativeTime(notification.created_at)}</span>
        </div>
      </div>
    </DropdownItem>
  )
}

const Notifications = () => {
  const { data: notifications = [], isLoading } = useNotifications({ status: 'all' })
  const { data: unreadCount = 0 } = useUnreadCount()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  // Show only the 5 most recent notifications in the dropdown
  const recentNotifications = notifications.slice(0, 5)

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate({ id, isRead: true })
  }

  const handleClearAll = () => {
    markAllAsRead.mutate()
  }

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button position-relative content-none"
        id="page-header-notifications-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <IconifyIcon icon="solar:bell-bing-outline" className="fs-22 align-middle" />
        {unreadCount > 0 && (
          <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu className="py-0 dropdown-lg dropdown-menu-end" aria-labelledby="page-header-notifications-dropdown">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0 fs-16 fw-semibold">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h6>
            </Col>
            {unreadCount > 0 && (
              <Col xs={'auto'}>
                <button 
                  onClick={handleClearAll} 
                  className="btn btn-link text-dark text-decoration-underline p-0"
                  disabled={markAllAsRead.isPending}
                >
                  <small>{markAllAsRead.isPending ? 'Marking...' : 'Mark All Read'}</small>
                </button>
              </Col>
            )}
          </Row>
        </div>
        <SimplebarReactClient style={{ maxHeight: 280 }}>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" variant="primary" />
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <IconifyIcon icon="bx:bell-off" className="fs-24 mb-2" />
              <p className="mb-0 small">No notifications</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          )}
        </SimplebarReactClient>
        <div className="text-center py-3">
          <Link to="/notifications" className="btn btn-primary btn-sm">
            View All Notifications <IconifyIcon icon="bx:right-arrow-alt" className="ms-1" />
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Notifications

import { Form, InputGroup, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { STATUS_OPTIONS } from '../constants'
import type { NotificationFilterStatus } from '../types'

interface NotificationFiltersProps {
  status: NotificationFilterStatus
  onStatusChange: (status: NotificationFilterStatus) => void
  onMarkAllAsRead: () => void
  isMarkingAll: boolean
  hasUnread: boolean
}

const NotificationFilters = ({
  status,
  onStatusChange,
  onMarkAllAsRead,
  isMarkingAll,
  hasUnread,
}: NotificationFiltersProps) => {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      <InputGroup style={{ width: 200 }}>
        <InputGroup.Text>
          <IconifyIcon icon="bx:filter" />
        </InputGroup.Text>
        <Form.Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as NotificationFilterStatus)}
          aria-label="Filter notifications"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

      {hasUnread && (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onMarkAllAsRead}
          disabled={isMarkingAll}
        >
          {isMarkingAll ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              Marking...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:check-double" className="me-1" />
              Mark All as Read
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default NotificationFilters

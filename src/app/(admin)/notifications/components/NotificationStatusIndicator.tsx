interface NotificationStatusIndicatorProps {
  isRead: boolean
}

const NotificationStatusIndicator = ({ isRead }: NotificationStatusIndicatorProps) => {
  return (
    <span
      className={`d-inline-block rounded-circle ${isRead ? 'bg-secondary' : 'bg-primary'}`}
      style={{ width: 10, height: 10 }}
      title={isRead ? 'Read' : 'Unread'}
    />
  )
}

export default NotificationStatusIndicator

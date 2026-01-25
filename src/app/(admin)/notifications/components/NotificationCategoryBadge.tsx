import { Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { NotificationCategory } from '../types'

interface NotificationCategoryBadgeProps {
  category: NotificationCategory | null
}

const CATEGORY_CONFIG: Record<NotificationCategory, { 
  variant: string
  icon: string 
  label: string 
}> = {
  case: { variant: 'primary', icon: 'bx:briefcase', label: 'Case' },
  appointment: { variant: 'info', icon: 'bx:calendar', label: 'Appointment' },
  document: { variant: 'success', icon: 'bx:file', label: 'Document' },
  system: { variant: 'secondary', icon: 'bx:cog', label: 'System' },
}

const NotificationCategoryBadge = ({ category }: NotificationCategoryBadgeProps) => {
  if (!category) return null
  
  const config = CATEGORY_CONFIG[category]
  if (!config) return null
  
  return (
    <Badge bg={config.variant} className="d-inline-flex align-items-center gap-1">
      <IconifyIcon icon={config.icon} className="fs-12" />
      {config.label}
    </Badge>
  )
}

export default NotificationCategoryBadge

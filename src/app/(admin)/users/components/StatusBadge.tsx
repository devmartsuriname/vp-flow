import { Badge } from 'react-bootstrap'

interface StatusBadgeProps {
  isActive: boolean
}

/**
 * Status badge component displaying active/inactive state
 */
export const StatusBadge = ({ isActive }: StatusBadgeProps) => {
  return (
    <Badge bg={isActive ? 'success' : 'secondary'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}

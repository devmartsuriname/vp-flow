import { Table } from 'react-bootstrap'
import { format } from 'date-fns'
import { RoleBadge } from './RoleBadge'
import { StatusBadge } from './StatusBadge'
import type { UserWithRole } from '../types'

interface UsersTableProps {
  users: UserWithRole[]
  currentUserId: string | null
}

/**
 * Table displaying user profiles with roles and status
 */
export const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
      return '—'
    }
  }

  return (
    <div className="table-responsive">
      <Table className="table-centered mb-0">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-sm me-2 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h6 className="mb-0">{user.full_name || 'Unnamed User'}</h6>
                    {user.id === currentUserId && (
                      <small className="text-muted">(You)</small>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>
                <StatusBadge isActive={user.is_active} />
              </td>
              <td className="text-muted">
                {formatDate(user.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

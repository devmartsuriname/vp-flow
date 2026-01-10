import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useAuthContext } from '@/context/useAuthContext'
import { isProtocol } from '@/hooks/useUserRole'
import { useUsers } from './hooks'
import { UserFiltersComponent, UsersTable, EmptyState } from './components'
import type { UserFilters } from './types'

/**
 * User Management page - read-only list of system users
 * - VP: sees all users with role badges
 * - Secretary: sees all users but only own role badge
 * - Protocol: redirected to dashboard
 */
const UsersPage = () => {
  const navigate = useNavigate()
  const { user, role, isLoading: authLoading } = useAuthContext()
  
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
  })

  // Redirect Protocol users
  useEffect(() => {
    if (!authLoading && role && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [authLoading, role, navigate])

  const {
    data: users,
    isLoading,
    error,
  } = useUsers({
    filters,
    currentUserId: user?.id || null,
    currentUserRole: role,
  })

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  // Block Protocol (should be redirected, but safety check)
  if (isProtocol(role)) {
    return null
  }

  const hasFilters = filters.search.trim() !== '' || filters.status !== 'all'

  return (
    <>
      <PageTitle title="User Management" subName="VP-Flow" />

      <Card>
        <CardHeader className="border-bottom">
          <h5 className="card-title mb-0">System Users</h5>
        </CardHeader>
        <CardBody>
          <UserFiltersComponent filters={filters} onFiltersChange={setFilters} />

          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2 mb-0">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-danger mb-0">
                Failed to load users: {error.message}
              </p>
            </div>
          ) : !users || users.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <UsersTable users={users} currentUserId={user?.id || null} />
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default UsersPage

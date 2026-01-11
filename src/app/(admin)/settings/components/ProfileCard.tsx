/**
 * ProfileCard - Read-only user profile display
 * Module 9 - Settings & System Configuration
 */

import { Card, CardBody, CardHeader, Badge, ListGroup, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { format } from 'date-fns'
import type { UserProfileData } from '../types'
import { ROLE_DISPLAY_NAMES } from '../constants'

interface ProfileCardProps {
  profile: UserProfileData | null
  isLoading: boolean
  error: Error | null
}

export function ProfileCard({ profile, isLoading, error }: ProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="h-100">
        <CardHeader className="border-bottom">
          <h5 className="card-title mb-0">
            <Icon icon="bx:user" className="me-2" />
            Profile Information
          </h5>
        </CardHeader>
        <CardBody className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-100">
        <CardHeader className="border-bottom">
          <h5 className="card-title mb-0">
            <Icon icon="bx:user" className="me-2" />
            Profile Information
          </h5>
        </CardHeader>
        <CardBody>
          <p className="text-danger mb-0">Failed to load profile information.</p>
        </CardBody>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="h-100">
        <CardHeader className="border-bottom">
          <h5 className="card-title mb-0">
            <Icon icon="bx:user" className="me-2" />
            Profile Information
          </h5>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-0">No profile data available.</p>
        </CardBody>
      </Card>
    )
  }

  const roleDisplayName = profile.role ? ROLE_DISPLAY_NAMES[profile.role] || profile.role : 'Unknown'

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom">
        <h5 className="card-title mb-0">
          <Icon icon="bx:user" className="me-2" />
          Profile Information
        </h5>
      </CardHeader>
      <CardBody className="p-0">
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Full Name</span>
            <span className="fw-medium">{profile.full_name || 'Not set'}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Email</span>
            <span className="fw-medium">{profile.email}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Role</span>
            <Badge bg={profile.role === 'vp' ? 'primary' : profile.role === 'secretary' ? 'info' : 'secondary'}>
              {roleDisplayName}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Account Status</span>
            <Badge bg={profile.is_active ? 'success' : 'danger'}>
              {profile.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Member Since</span>
            <span className="fw-medium">
              {format(new Date(profile.created_at), 'MMM d, yyyy')}
            </span>
          </ListGroup.Item>
        </ListGroup>
      </CardBody>
    </Card>
  )
}

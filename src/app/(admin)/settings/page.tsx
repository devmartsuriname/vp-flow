/**
 * Settings Page - Settings & System Configuration
 * Module 9 - Phase 4 UI Implementation
 * 
 * Role Access:
 * - VP: Full access to all 4 cards
 * - Secretary: Access to Profile, Theme, Notifications cards
 * - Protocol: Redirected to dashboard
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useAuthContext } from '@/context/useAuthContext'
import { isProtocol, isVP } from '@/hooks/useUserRole'
import { useUserProfile } from './hooks'
import {
  ProfileCard,
  ThemeSettingsCard,
  SystemInfoCard,
} from './components'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, session, role, isLoading: authLoading } = useAuthContext()

  // Redirect Protocol users
  useEffect(() => {
    if (!authLoading && role && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [authLoading, role, navigate])

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile()

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

  // Get session start time for "Last Login" display
  const sessionStartTime = session?.access_token 
    ? new Date().toISOString() // Session doesn't expose created_at, use current time as approximation
    : null

  return (
    <>
      <PageTitle title="Settings" subName="VP-Flow" />

      <Row className="g-4 mb-4">
        {/* Profile Information - All roles */}
        <Col lg={6}>
          <ProfileCard
            profile={profile ?? null}
            isLoading={profileLoading}
            error={profileError as Error | null}
          />
        </Col>

        {/* Theme Preferences - All roles */}
        <Col lg={6}>
          <ThemeSettingsCard />
        </Col>

        {/* System Information - All roles (VP sees extra info) */}
        <Col lg={6}>
          <SystemInfoCard
            lastLogin={sessionStartTime}
            role={role}
          />
        </Col>
      </Row>
    </>
  )
}

export default SettingsPage

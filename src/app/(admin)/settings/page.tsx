/**
 * Settings Page - Settings & System Configuration
 * Module 9 - Phase 4 UI Implementation
 *
 * Role Access:
 * - VP: Full access to all 4 cards
 * - Secretary: Full access to all 4 cards
 * - Protocol: Profile, Theme, System Info (Push toggle hidden internally)
 */

import { Row, Col, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useAuthContext } from '@/context/useAuthContext'
import { useUserProfile } from './hooks'
import {
  ProfileCard,
  ThemeSettingsCard,
  SystemInfoCard,
  PushNotificationToggle,
} from './components'

const SettingsPage = () => {
  const { session, role, isLoading: authLoading } = useAuthContext()

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

        {/* Push Notifications - VP and Secretary (Protocol guarded internally) */}
        <Col lg={6}>
          <PushNotificationToggle />
        </Col>
      </Row>
    </>
  )
}

export default SettingsPage

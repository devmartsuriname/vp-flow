/**
 * Settings Page — 5-tab layout (TC-018)
 *
 * Tabs:
 *   1. Profiel        — all roles
 *   2. Weergave       — all roles
 *   3. Notificaties   — all roles (consolidated push + email preference toggles)
 *   4. Systeem        — all roles (VP sees extra admin info)
 *   5. E-mail Config  — VP + Secretary (hidden for Protocol — not rendered)
 */

import { Card, Tab, Nav, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuthContext } from '@/context/useAuthContext'
import { isProtocol } from '@/hooks/useUserRole'
import { useUserProfile } from './hooks'
import {
  ProfileCard,
  ThemeSettingsCard,
  SystemInfoCard,
  EmailSettingsCard,
  NotificationPreferencesCard,
} from './components'

const SettingsPage = () => {
  const { session, role, isLoading: authLoading } = useAuthContext()

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile()

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  const sessionStartTime = session?.access_token ? new Date().toISOString() : null
  const showEmailConfig = !isProtocol(role)

  return (
    <>
      <PageTitle title="Settings" subName="VP-Flow" />

      <Card>
        <Card.Body>
          <Tab.Container defaultActiveKey="profile">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <IconifyIcon icon="bx:user" className="me-1" />
                  Profiel
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appearance">
                  <IconifyIcon icon="bx:palette" className="me-1" />
                  Weergave
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="notifications">
                  <IconifyIcon icon="bx:bell" className="me-1" />
                  Notificaties
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="system">
                  <IconifyIcon icon="bx:info-circle" className="me-1" />
                  Systeem
                </Nav.Link>
              </Nav.Item>
              {showEmailConfig && (
                <Nav.Item>
                  <Nav.Link eventKey="email-config">
                    <IconifyIcon icon="bx:envelope" className="me-1" />
                    E-mail Config
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <ProfileCard
                  profile={profile ?? null}
                  isLoading={profileLoading}
                  error={profileError as Error | null}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="appearance">
                <ThemeSettingsCard />
              </Tab.Pane>

              <Tab.Pane eventKey="notifications">
                <NotificationPreferencesCard />
              </Tab.Pane>

              <Tab.Pane eventKey="system">
                <SystemInfoCard lastLogin={sessionStartTime} role={role} />
              </Tab.Pane>

              {showEmailConfig && (
                <Tab.Pane eventKey="email-config">
                  <EmailSettingsCard />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </>
  )
}

export default SettingsPage

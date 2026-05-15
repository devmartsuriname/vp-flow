/**
 * NotificationPreferencesCard — per-user push + email channel toggles.
 * TC-011 Phase 1B — Notification Preferences.
 *
 * Role Access: All roles (VP, Secretary, Protocol) — each user manages own preferences.
 * Opt-out model: no row = both channels enabled (defaults rendered ON).
 */

import { Card, ListGroup, Form, Spinner, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  useGetNotificationPreferences,
  useUpsertNotificationPreferences,
} from '../hooks/useNotificationPreferences'
import { usePushSubscription } from '@/hooks/usePushSubscription'

const NotificationPreferencesCard = () => {
  const { data, isLoading, error } = useGetNotificationPreferences()
  const upsert = useUpsertNotificationPreferences()
  const { isSubscribed, isSupported, permission } = usePushSubscription()

  const getPushStatusBadge = () => {
    if (!isSupported) {
      return <Badge bg="secondary">Not Supported</Badge>
    }
    if (permission === 'denied') {
      return <Badge bg="danger">Blocked</Badge>
    }
    if (isSubscribed) {
      return <Badge bg="success">Active</Badge>
    }
    return <Badge bg="warning" text="dark">Inactive</Badge>
  }

  // Opt-out model: missing row → both ON by default
  const pushEnabled = data?.push_enabled ?? true
  const emailEnabled = data?.email_enabled ?? true

  const handleToggle = async (channel: 'push' | 'email', next: boolean) => {
    const nextValues = {
      push_enabled: channel === 'push' ? next : pushEnabled,
      email_enabled: channel === 'email' ? next : emailEnabled,
    }

    try {
      await upsert.mutateAsync(nextValues)
      toast.success(
        channel === 'push'
          ? next
            ? 'Push notifications enabled'
            : 'Push notifications disabled'
          : next
            ? 'Email notifications enabled'
            : 'Email notifications disabled',
      )
    } catch (err) {
      console.error('Failed to update notification preferences:', err)
      toast.error('Failed to update notification preferences')
    }
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title mb-0">Notification Preferences</h4>
      </Card.Header>
      <Card.Body className="p-0">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        ) : error ? (
          <div className="p-3">
            <small className="text-danger">
              Failed to load notification preferences.
            </small>
          </div>
        ) : (
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-semibold me-2">Push notificaties</span>
                {getPushStatusBadge()}
                <br />
                <small className="text-muted">
                  Ontvang browser push-meldingen voor afspraken, dossiers en documenten
                </small>
              </div>
              <Form.Check
                type="switch"
                id="notification-pref-push"
                checked={pushEnabled}
                disabled={upsert.isPending}
                onChange={(e) => handleToggle('push', e.target.checked)}
              />
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-semibold">E-mail notificaties</span>
                <br />
                <small className="text-muted">
                  Ontvang e-mailmeldingen voor afspraken, dossiers en documenten
                </small>
              </div>
              <Form.Check
                type="switch"
                id="notification-pref-email"
                checked={emailEnabled}
                disabled={upsert.isPending}
                onChange={(e) => handleToggle('email', e.target.checked)}
              />
            </ListGroup.Item>

            <ListGroup.Item>
              <small className="text-muted">
                Deze voorkeuren gelden alleen voor uw eigen account. Het uitschakelen
                van een kanaal stopt de bezorging via dat kanaal direct.
              </small>
            </ListGroup.Item>
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  )
}

export default NotificationPreferencesCard

/**
 * NotificationPrefsCard - UI Scaffold for notification preferences
 * Module 9 - Settings & System Configuration
 * 
 * NOTE: All toggles are DISABLED in v1.0 (UI scaffold only)
 */

import { Card, CardBody, CardHeader, Form, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { DEFAULT_NOTIFICATION_PREFS } from '../constants'

export function NotificationPrefsCard() {
  return (
    <Card className="h-100">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <Icon icon="bx:bell" className="me-2" />
          Notification Preferences
        </h5>
        <Badge bg="secondary">Coming Soon</Badge>
      </CardHeader>
      <CardBody>
        <p className="text-muted small mb-3">
          Notification preferences will be available in a future update.
        </p>
        <div className="d-flex flex-column gap-3">
          {DEFAULT_NOTIFICATION_PREFS.map((pref) => (
            <div key={pref.id} className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-medium d-block">{pref.label}</span>
                <span className="text-muted small">{pref.description}</span>
              </div>
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip id={`tooltip-${pref.id}`}>Coming soon in a future update</Tooltip>}
              >
                <div>
                  <Form.Check
                    type="switch"
                    id={pref.id}
                    checked={pref.enabled}
                    disabled={pref.disabled}
                    readOnly
                    className="opacity-50"
                  />
                </div>
              </OverlayTrigger>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * SystemInfoCard - Read-only system information display
 * Module 9 - Settings & System Configuration
 */

import { Card, CardBody, CardHeader, ListGroup, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { format } from 'date-fns'
import { APP_INFO } from '../constants'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

interface SystemInfoCardProps {
  lastLogin: string | null
  role: VPFlowRole | null
}

/**
 * Detect if app is running as installed PWA
 */
const isPWAInstalled = (): boolean => {
  // Check display-mode media query (standard)
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  // iOS Safari standalone check
  if ((window.navigator as any).standalone === true) return true
  return false
}

export function SystemInfoCard({ lastLogin, role }: SystemInfoCardProps) {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy')
  const currentTime = format(new Date(), 'h:mm a')
  const pwaInstalled = isPWAInstalled()

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom">
        <h5 className="card-title mb-0">
          <IconifyIcon icon="bx:info-circle" className="me-2" />
          System Information
        </h5>
      </CardHeader>
      <CardBody className="p-0">
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Application</span>
            <span className="fw-medium">{APP_INFO.appName}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Version</span>
            <Badge bg="soft-primary" className="text-primary">
              v{APP_INFO.version}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Environment</span>
            <Badge bg="soft-success" className="text-success">
              {APP_INFO.environment}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              <IconifyIcon icon="bx:mobile-alt" className="me-1" />
              PWA Status
            </span>
            {pwaInstalled ? (
              <Badge bg="soft-success" className="text-success">
                Installed
              </Badge>
            ) : (
              <Badge bg="soft-secondary" className="text-secondary">
                Browser
              </Badge>
            )}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Current Date</span>
            <span className="fw-medium">{currentDate}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Current Time</span>
            <span className="fw-medium">{currentTime}</span>
          </ListGroup.Item>
          {lastLogin && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Session Started</span>
              <span className="fw-medium">
                {format(new Date(lastLogin), 'MMM d, yyyy h:mm a')}
              </span>
            </ListGroup.Item>
          )}
          {isVP(role) && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
              <span className="text-muted">
                <IconifyIcon icon="bx:shield-quarter" className="me-1" />
                Admin Access
              </span>
              <Badge bg="primary">Full System Access</Badge>
            </ListGroup.Item>
          )}
        </ListGroup>
      </CardBody>
    </Card>
  )
}

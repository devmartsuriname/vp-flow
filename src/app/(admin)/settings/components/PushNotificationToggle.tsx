/**
 * PushNotificationToggle — Push notification permission and subscription management
 * v2.0 Phase 1A.1
 * 
 * Role Access: VP, Secretary (Protocol redirected from Settings)
 */

import { Card, ListGroup, Form, Spinner, Badge } from 'react-bootstrap';
import { usePushSubscription } from '@/hooks/usePushSubscription';
import { toast } from 'react-toastify';

const PushNotificationToggle = () => {
  const {
    isSubscribed,
    isLoading,
    isSupported,
    permission,
    subscribe,
    unsubscribe,
  } = usePushSubscription();

  const handleToggle = async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success('Push notifications disabled');
      } else {
        toast.error('Failed to disable push notifications');
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast.success('Push notifications enabled');
      } else if (permission === 'denied') {
        toast.error('Push notifications are blocked. Please enable them in your browser settings.');
      } else {
        toast.error('Failed to enable push notifications');
      }
    }
  };

  const getStatusBadge = () => {
    if (!isSupported) {
      return <Badge bg="secondary">Not Supported</Badge>;
    }
    if (permission === 'denied') {
      return <Badge bg="danger">Blocked</Badge>;
    }
    if (isSubscribed) {
      return <Badge bg="success">Active</Badge>;
    }
    return <Badge bg="warning" text="dark">Inactive</Badge>;
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title mb-0">Push Notifications</h4>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">Status</span>
            </div>
            {getStatusBadge()}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">Enable Push Notifications</span>
              <br />
              <small className="text-muted">
                Receive browser notifications for appointments, cases, and documents
              </small>
            </div>
            {isLoading ? (
              <Spinner animation="border" size="sm" variant="primary" />
            ) : (
              <Form.Check
                type="switch"
                id="push-notification-toggle"
                checked={isSubscribed}
                onChange={handleToggle}
                disabled={!isSupported || permission === 'denied'}
              />
            )}
          </ListGroup.Item>

          {permission === 'denied' && (
            <ListGroup.Item>
              <small className="text-danger">
                Push notifications are blocked by your browser. To enable them, go to your browser's 
                site settings and allow notifications for this site.
              </small>
            </ListGroup.Item>
          )}

          {!isSupported && (
            <ListGroup.Item>
              <small className="text-muted">
                Push notifications are not supported in this browser.
              </small>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PushNotificationToggle;

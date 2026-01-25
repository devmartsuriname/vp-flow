import { Card, CardBody, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useOffline } from '@/context/useOfflineContext'

type OfflineAwareErrorProps = {
  error: Error | null
  entityName?: string
  onRetry?: () => void
}

const OfflineAwareError = ({ 
  error, 
  entityName = 'Data',
  onRetry 
}: OfflineAwareErrorProps) => {
  const { isOffline } = useOffline()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  // Offline-specific error display
  if (isOffline) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <IconifyIcon 
            icon="bx:wifi-off" 
            className="text-warning fs-1 mb-3" 
          />
          <h5>Connection Required</h5>
          <p className="text-muted mb-3">
            {entityName} cannot be loaded while offline. Please check your internet connection.
          </p>
          <Button 
            variant="outline-primary" 
            onClick={handleRetry}
            disabled={isOffline}
          >
            <IconifyIcon icon="bx:refresh" className="me-1" />
            Try Again
          </Button>
        </CardBody>
      </Card>
    )
  }

  // Standard error display (online but failed)
  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <IconifyIcon 
            icon="bx:error-circle" 
            className="text-danger fs-1 mb-3" 
          />
          <h5>Error Loading {entityName}</h5>
          <p className="text-muted mb-3">{error.message}</p>
          <Button variant="outline-primary" onClick={handleRetry}>
            <IconifyIcon icon="bx:refresh" className="me-1" />
            Try Again
          </Button>
        </CardBody>
      </Card>
    )
  }

  return null
}

export default OfflineAwareError

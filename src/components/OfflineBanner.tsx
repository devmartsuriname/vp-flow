import { Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useOffline } from '@/context/useOfflineContext'

const OfflineBanner = () => {
  const { isOffline } = useOffline()

  if (!isOffline) {
    return null
  }

  return (
    <Alert 
      variant="warning" 
      className="mb-0 rounded-0 d-flex align-items-center gap-2 py-2"
    >
      <IconifyIcon icon="bx:wifi-off" className="fs-5" />
      <span>
        <strong>You are offline.</strong> Data requires an internet connection.
      </span>
    </Alert>
  )
}

export default OfflineBanner

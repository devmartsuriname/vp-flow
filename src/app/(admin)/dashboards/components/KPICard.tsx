import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Link } from 'react-router-dom'
import type { KPICardData } from '../types'

interface KPICardProps extends KPICardData {}

const KPICard = ({ title, count, icon, color, link }: KPICardProps) => {
  const cardContent = (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 me-3">
            <div
              className={`avatar-sm rounded bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center`}
            >
              <IconifyIcon icon={icon} width={24} height={24} className={`text-${color}`} />
            </div>
          </div>
          <div className="flex-grow-1">
            <h4 className="mb-1">{count.toLocaleString()}</h4>
            <p className="text-muted mb-0 fs-13">{title}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )

  if (link) {
    return (
      <Link to={link} className="text-decoration-none">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export default KPICard

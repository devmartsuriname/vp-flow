import { Card, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { formatFileSize, getFileExtension, getFileIcon } from '../types'
import { formatDateTime } from '../constants'
import type { Document } from '../types'
import EntityTypeBadge from './EntityTypeBadge'

type DocumentCardProps = {
  document: Document
  onView?: () => void
  onDownload?: () => void
  onDeactivate?: () => void
  canDeactivate?: boolean
}

export default function DocumentCard({
  document,
  onView,
  onDownload,
  onDeactivate,
  canDeactivate,
}: DocumentCardProps) {
  const fileExt = getFileExtension(document.mime_type)
  const fileIcon = getFileIcon(document.mime_type)

  return (
    <Card className={`mb-3 ${!document.is_active ? 'opacity-50' : ''}`}>
      <Card.Body>
        <div className="d-flex align-items-start gap-3">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{ width: 48, height: 48 }}
            >
              <IconifyIcon icon={fileIcon} className="fs-4 text-primary" />
            </div>
          </div>

          {/* File Info */}
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h6 className="mb-0 text-truncate">{document.title || document.file_name}</h6>
              <Badge bg="light" text="dark" className="text-uppercase">
                {fileExt}
              </Badge>
              {!document.is_active && (
                <Badge bg="danger">Deactivated</Badge>
              )}
            </div>
            {document.description && (
              <p className="text-muted small mb-1 text-truncate">{document.description}</p>
            )}
            <div className="d-flex align-items-center gap-3 text-muted small">
              <span>{formatFileSize(document.file_size)}</span>
              <span>•</span>
              <EntityTypeBadge entityType={document.entity_type} />
              <span>•</span>
              <span>{formatDateTime(document.uploaded_at)}</span>
            </div>
          </div>

          {/* Actions */}
          {document.is_active && (
            <div className="flex-shrink-0 d-flex gap-2">
              {onView && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={onView}
                  title="View"
                >
                  <IconifyIcon icon="bx:show" />
                </button>
              )}
              {onDownload && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onDownload}
                  title="Download"
                >
                  <IconifyIcon icon="bx:download" />
                </button>
              )}
              {canDeactivate && onDeactivate && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={onDeactivate}
                  title="Deactivate"
                >
                  <IconifyIcon icon="bx:trash" />
                </button>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

import { Accordion, Badge, Button, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useDocumentVersionHistory } from '../hooks'
import { formatFileSize, getFileIcon, type Document } from '../types'
import { formatDateTime } from '../constants'
import DocumentStatusBadge from './DocumentStatusBadge'

type VersionHistoryAccordionProps = {
  documentId: string
  onView?: (doc: Document) => void
  onDownload?: (doc: Document) => void
}

export default function VersionHistoryAccordion({
  documentId,
  onView,
  onDownload,
}: VersionHistoryAccordionProps) {
  const { data: versions = [], isLoading, error } = useDocumentVersionHistory(documentId)

  if (isLoading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading version history...
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger py-2 mb-0">
        Failed to load version history
      </div>
    )
  }

  // If only one version exists, don't show the accordion
  if (versions.length <= 1) {
    return null
  }

  return (
    <Accordion className="mt-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <IconifyIcon icon="bx:history" className="me-2" />
          Version History
          <Badge bg="secondary" className="ms-2">{versions.length} versions</Badge>
        </Accordion.Header>
        <Accordion.Body className="p-0">
          <div className="list-group list-group-flush">
            {versions.map((doc) => (
              <div
                key={doc.id}
                className={`list-group-item d-flex align-items-center justify-content-between ${
                  doc.is_current_version ? 'bg-light' : ''
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <IconifyIcon 
                    icon={getFileIcon(doc.mime_type)} 
                    className="fs-5 text-primary" 
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-medium">v{doc.version_number ?? 1}</span>
                      {doc.is_current_version && (
                        <Badge bg="primary" className="text-uppercase" style={{ fontSize: '0.65rem' }}>
                          Current
                        </Badge>
                      )}
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                    <small className="text-muted">
                      {doc.title || doc.file_name} • {formatFileSize(doc.file_size)} • {formatDateTime(doc.uploaded_at)}
                    </small>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  {doc.is_active && onView && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onView(doc)}
                      title="View"
                    >
                      <IconifyIcon icon="bx:show" />
                    </Button>
                  )}
                  {doc.is_active && onDownload && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onDownload(doc)}
                      title="Download"
                    >
                      <IconifyIcon icon="bx:download" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

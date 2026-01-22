import { Table, Spinner, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { formatFileSize, getFileExtension, getFileIcon } from '../types'
import { formatDateTime } from '../constants'
import type { Document } from '../types'
import type { VPFlowRole } from '@/types/auth'
import { isVP } from '@/hooks/useUserRole'
import EntityTypeBadge from './EntityTypeBadge'

type DocumentsTableProps = {
  documents: Document[]
  isLoading: boolean
  userRole: VPFlowRole | null
  onView?: (doc: Document) => void
  onDownload?: (doc: Document) => void
  onDeactivate?: (doc: Document) => void
}

export default function DocumentsTable({
  documents,
  isLoading,
  userRole,
  onView,
  onDownload,
  onDeactivate,
}: DocumentsTableProps) {
  const canDeactivate = isVP(userRole)

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" size="sm" />
        <span className="ms-2">Loading documents...</span>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <IconifyIcon icon="bx:file" className="fs-1 mb-2" />
        <p className="mb-0">No documents found</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <Table className="table-centered mb-0">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th>Document</th>
            <th>Type</th>
            <th>Size</th>
            <th>Linked To</th>
            <th>Uploaded</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className={!doc.is_active ? 'opacity-50' : ''}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <IconifyIcon icon={getFileIcon(doc.mime_type)} className="text-primary" />
                  <div>
                    <div className="fw-medium text-truncate" style={{ maxWidth: 200 }}>
                      {doc.title || doc.file_name}
                    </div>
                    <small className="text-muted">{doc.file_name}</small>
                  </div>
                </div>
              </td>
              <td>
                <Badge bg="light" text="dark" className="text-uppercase">
                  {getFileExtension(doc.mime_type)}
                </Badge>
              </td>
              <td>{formatFileSize(doc.file_size)}</td>
              <td>
                <EntityTypeBadge entityType={doc.entity_type} />
              </td>
              <td>
                <small>{formatDateTime(doc.uploaded_at)}</small>
              </td>
              <td>
                {doc.is_active ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="danger">Deactivated</Badge>
                )}
              </td>
              <td>
                <div className="d-flex justify-content-end gap-1">
                  {doc.is_active && onView && (
                    <button
                      type="button"
                      className="btn btn-sm btn-soft-primary"
                      onClick={() => onView(doc)}
                      title="View"
                    >
                      <IconifyIcon icon="bx:show" />
                    </button>
                  )}
                  {doc.is_active && onDownload && (
                    <button
                      type="button"
                      className="btn btn-sm btn-soft-secondary"
                      onClick={() => onDownload(doc)}
                      title="Download"
                    >
                      <IconifyIcon icon="bx:download" />
                    </button>
                  )}
                  {doc.is_active && canDeactivate && onDeactivate && (
                    <button
                      type="button"
                      className="btn btn-sm btn-soft-danger"
                      onClick={() => onDeactivate(doc)}
                      title="Deactivate"
                    >
                      <IconifyIcon icon="bx:trash" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

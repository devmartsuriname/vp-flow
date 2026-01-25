import { useState } from 'react'
import { Table, Spinner, Badge, Dropdown } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { formatFileSize, getFileExtension, getFileIcon, type Document, type DocumentStatus } from '../types'
import { formatDateTime } from '../constants'
import type { VPFlowRole } from '@/types/auth'
import { isVP, isSecretary } from '@/hooks/useUserRole'
import EntityTypeBadge from './EntityTypeBadge'
import DocumentStatusBadge from './DocumentStatusBadge'

type DocumentsTableProps = {
  documents: Document[]
  isLoading: boolean
  userRole: VPFlowRole | null
  onView?: (doc: Document) => void
  onDownload?: (doc: Document) => void
  onDeactivate?: (doc: Document) => void
  onChangeStatus?: (doc: Document) => void
  onUploadVersion?: (doc: Document) => void
  onShowVersionHistory?: (doc: Document) => void
}

export default function DocumentsTable({
  documents,
  isLoading,
  userRole,
  onView,
  onDownload,
  onDeactivate,
  onChangeStatus,
  onUploadVersion,
  onShowVersionHistory,
}: DocumentsTableProps) {
  const canDeactivate = isVP(userRole)
  const canChangeStatus = isVP(userRole) || isSecretary(userRole)
  const canUploadVersion = isVP(userRole) || isSecretary(userRole)

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
            <th>Version</th>
            <th>Status</th>
            <th>Linked To</th>
            <th>Uploaded</th>
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
                <Badge 
                  bg={doc.is_current_version ? 'primary' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => onShowVersionHistory?.(doc)}
                  title="View version history"
                  style={{ cursor: 'pointer' }}
                >
                  v{doc.version_number ?? 1}
                  {doc.is_current_version && (
                    <IconifyIcon icon="bx:check" className="ms-1" />
                  )}
                </Badge>
              </td>
              <td>
                <DocumentStatusBadge status={doc.status as DocumentStatus} />
              </td>
              <td>
                <EntityTypeBadge entityType={doc.entity_type} />
              </td>
              <td>
                <small>{formatDateTime(doc.uploaded_at)}</small>
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
                  
                  {doc.is_active && (canChangeStatus || canUploadVersion || canDeactivate) && (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="soft-dark"
                        size="sm"
                        id={`doc-actions-${doc.id}`}
                        className="btn-icon"
                      >
                        <IconifyIcon icon="bx:dots-vertical-rounded" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        {canChangeStatus && onChangeStatus && doc.status !== 'archived' && (
                          <Dropdown.Item onClick={() => onChangeStatus(doc)}>
                            <IconifyIcon icon="bx:transfer" className="me-2" />
                            Change Status
                          </Dropdown.Item>
                        )}
                        {canUploadVersion && onUploadVersion && doc.is_current_version && doc.status !== 'archived' && (
                          <Dropdown.Item onClick={() => onUploadVersion(doc)}>
                            <IconifyIcon icon="bx:revision" className="me-2" />
                            Upload New Version
                          </Dropdown.Item>
                        )}
                        {onShowVersionHistory && (
                          <Dropdown.Item onClick={() => onShowVersionHistory(doc)}>
                            <IconifyIcon icon="bx:history" className="me-2" />
                            Version History
                          </Dropdown.Item>
                        )}
                        {(canChangeStatus || canUploadVersion) && canDeactivate && <Dropdown.Divider />}
                        {canDeactivate && onDeactivate && (
                          <Dropdown.Item 
                            onClick={() => onDeactivate(doc)}
                            className="text-danger"
                          >
                            <IconifyIcon icon="bx:trash" className="me-2" />
                            Deactivate
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
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

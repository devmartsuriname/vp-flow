import { useState } from 'react'
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useDocuments, useUploadDocument, useDeactivateDocument, useDocumentAudit } from '../hooks'
import { UploadModal, DeactivateModal } from './index'
import { formatFileSize, getFileIcon, getFileExtension } from '../types'
import type { Document, DocumentEntityType } from '../types'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'
import { supabase } from '@/integrations/supabase/client'

type LinkedDocumentsProps = {
  entityType: DocumentEntityType
  entityId: string
  entityName: string
  userRole: VPFlowRole | null
  readOnly?: boolean
}

export default function LinkedDocuments({
  entityType,
  entityId,
  entityName,
  userRole,
  readOnly = false,
}: LinkedDocumentsProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Fetch documents linked to this entity
  const { data: documents = [], isLoading, isError } = useDocuments({
    entityType,
    entityId,
    activeOnly: true,
  })

  const uploadMutation = useUploadDocument()
  const deactivateMutation = useDeactivateDocument()
  const auditMutation = useDocumentAudit()

  // Role-based permissions
  const canUpload = !readOnly && (isVP(userRole) || userRole === 'secretary')
  const canDeactivate = isVP(userRole)

  const handleUpload = (file: File, title: string, description: string) => {
    uploadMutation.mutate(
      {
        file,
        title,
        description,
        entity_type: entityType,
        entity_id: entityId,
      },
      {
        onSuccess: () => {
          setShowUploadModal(false)
        },
      }
    )
  }

  const handleDeactivate = () => {
    if (!selectedDocument) return
    deactivateMutation.mutate(selectedDocument.id, {
      onSuccess: () => {
        setShowDeactivateModal(false)
        setSelectedDocument(null)
      },
    })
  }

  const handleView = async (doc: Document) => {
    // Log audit event
    auditMutation.mutate({ document: doc, action: 'document_viewed' })

    // Get signed URL and open in new tab
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path, 300)

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  const handleDownload = async (doc: Document) => {
    // Log audit event
    auditMutation.mutate({ document: doc, action: 'document_downloaded' })

    // Get signed URL and trigger download
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path, 300)

    if (data?.signedUrl) {
      const link = document.createElement('a')
      link.href = data.signedUrl
      link.download = doc.file_name
      link.click()
    }
  }

  const openDeactivateModal = (doc: Document) => {
    setSelectedDocument(doc)
    setShowDeactivateModal(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="bx:file" className="me-2" />
            Documents
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading documents...
        </Card.Body>
      </Card>
    )
  }

  // Error state
  if (isError) {
    return (
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="bx:file" className="me-2" />
            Documents
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-danger mb-0">Failed to load documents.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="bx:file" className="me-2" />
            Documents
            {documents.length > 0 && (
              <span className="badge bg-secondary ms-2">{documents.length}</span>
            )}
          </h5>
          {canUpload && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setShowUploadModal(true)}
            >
              <IconifyIcon icon="bx:upload" className="me-1" />
              Upload
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {documents.length === 0 ? (
            <p className="text-muted mb-0">No documents attached.</p>
          ) : (
            <Row className="g-3">
              {documents.map((doc) => (
                <Col key={doc.id} xs={12}>
                  <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                    <div className="d-flex align-items-center gap-3">
                      <IconifyIcon 
                        icon={getFileIcon(doc.mime_type)} 
                        className="fs-4 text-primary" 
                      />
                      <div>
                        <div className="fw-medium">{doc.title || doc.file_name}</div>
                        <small className="text-muted">
                          {getFileExtension(doc.mime_type)} • {formatFileSize(doc.file_size)}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleView(doc)}
                        title="View"
                      >
                        <IconifyIcon icon="bx:show" />
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => handleDownload(doc)}
                        title="Download"
                      >
                        <IconifyIcon icon="bx:download" />
                      </Button>
                      {canDeactivate && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => openDeactivateModal(doc)}
                          title="Deactivate"
                        >
                          <IconifyIcon icon="bx:trash" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <UploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        isLoading={uploadMutation.isPending}
        entityType={entityType}
        entityName={entityName}
      />

      {/* Deactivate Modal */}
      <DeactivateModal
        show={showDeactivateModal}
        onHide={() => {
          setShowDeactivateModal(false)
          setSelectedDocument(null)
        }}
        onConfirm={handleDeactivate}
        isLoading={deactivateMutation.isPending}
        documentTitle={selectedDocument?.title || selectedDocument?.file_name || ''}
      />
    </>
  )
}

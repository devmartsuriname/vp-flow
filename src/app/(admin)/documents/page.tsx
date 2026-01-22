import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useDocuments, useDeactivateDocument } from './hooks'
import { DocumentsTable, DeactivateModal } from './components'
import { ENTITY_TYPE_OPTIONS } from './constants'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'
import type { Document, DocumentEntityType } from './types'

const DocumentsPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const [entityTypeFilter, setEntityTypeFilter] = useState<DocumentEntityType | ''>('')
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const { data: documents = [], isLoading, error } = useDocuments({
    entityType: entityTypeFilter || undefined,
    activeOnly: true,
  })

  const deactivateDocument = useDeactivateDocument()

  // Redirect Protocol users - they cannot access documents
  useEffect(() => {
    if (!authLoading && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && isProtocol(role)) return null

  const handleView = async (doc: Document) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 3600) // 1 hour expiry

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err) {
      console.error('Failed to get view URL:', err)
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60, { download: doc.file_name })

      if (data?.signedUrl) {
        const link = document.createElement('a')
        link.href = data.signedUrl
        link.download = doc.file_name
        link.click()
      }
    } catch (err) {
      console.error('Failed to download:', err)
    }
  }

  const handleDeactivate = (doc: Document) => {
    setSelectedDocument(doc)
    setShowDeactivateModal(true)
  }

  const handleDeactivateConfirm = () => {
    if (selectedDocument) {
      deactivateDocument.mutate(selectedDocument.id, {
        onSuccess: () => {
          setShowDeactivateModal(false)
          setSelectedDocument(null)
        },
      })
    }
  }

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Documents" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Documents</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle subName="VP-Flow" title="Documents" />
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Document Library</h5>
              <p className="text-muted mb-0">
                View and manage documents linked to cases, appointments, and guests
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-3">
        <CardBody>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select
                  value={entityTypeFilter}
                  onChange={(e) => setEntityTypeFilter(e.target.value as DocumentEntityType | '')}
                >
                  {ENTITY_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8} className="text-end">
              <small className="text-muted">
                Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
              </small>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardBody>
          <DocumentsTable
            documents={documents}
            isLoading={isLoading}
            userRole={role}
            onView={handleView}
            onDownload={handleDownload}
            onDeactivate={handleDeactivate}
          />
        </CardBody>
      </Card>

      {/* Deactivate Modal */}
      <DeactivateModal
        show={showDeactivateModal}
        onHide={() => {
          setShowDeactivateModal(false)
          setSelectedDocument(null)
        }}
        onConfirm={handleDeactivateConfirm}
        isLoading={deactivateDocument.isPending}
        documentTitle={selectedDocument?.title || selectedDocument?.file_name || ''}
      />
    </>
  )
}

export default DocumentsPage

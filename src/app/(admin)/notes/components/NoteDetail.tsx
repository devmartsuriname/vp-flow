import { useState, useEffect } from 'react'
import { Card, Row, Col, Badge, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { format } from 'date-fns'
import type { NoteWithLink, NoteLink, NoteEntityType } from '../types'
import { getNoteDisplayTitle, ENTITY_TYPE_LABELS } from '../types'
import { useUnlinkNote } from '../hooks'
import { supabase } from '@/integrations/supabase/client'
import HandwritingSection from './HandwritingSection'
import { useAuthContext } from '@/context/useAuthContext'

type NoteDetailProps = {
  note: NoteWithLink
  onDelete?: () => void
  readOnly?: boolean
}

// Helper to get first link
function getFirstLink(noteLinks: NoteLink | NoteLink[] | null): NoteLink | null {
  if (!noteLinks) return null
  if (Array.isArray(noteLinks)) {
    return noteLinks.length > 0 ? noteLinks[0] : null
  }
  return noteLinks
}

export default function NoteDetail({ note, onDelete, readOnly = false }: NoteDetailProps) {
  const link = getFirstLink(note.note_links)
  const unlinkMutation = useUnlinkNote()
  const [linkedEntityName, setLinkedEntityName] = useState<string | null>(null)
  const [loadingEntity, setLoadingEntity] = useState(false)
  const { user } = useAuthContext()

  // Fetch linked entity display name
  useEffect(() => {
    if (!link) {
      setLinkedEntityName(null)
      return
    }

    const fetchEntityName = async () => {
      setLoadingEntity(true)
      try {
        if (link.entity_type === 'guest') {
          const { data } = await supabase
            .from('clients')
            .select('first_name, last_name, organization_name, client_type')
            .eq('id', link.entity_id)
            .maybeSingle()
          if (data) {
            if (data.client_type === 'organization') {
              setLinkedEntityName(data.organization_name || 'Unnamed Organization')
            } else {
              setLinkedEntityName(`${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unnamed Guest')
            }
          }
        } else if (link.entity_type === 'appointment') {
          const { data } = await supabase
            .from('appointments')
            .select('subject')
            .eq('id', link.entity_id)
            .maybeSingle()
          if (data) {
            setLinkedEntityName(data.subject)
          }
        } else if (link.entity_type === 'case') {
          const { data } = await supabase
            .from('cases')
            .select('title, case_number')
            .eq('id', link.entity_id)
            .maybeSingle()
          if (data) {
            setLinkedEntityName(`${data.case_number}: ${data.title}`)
          }
        }
      } finally {
        setLoadingEntity(false)
      }
    }

    fetchEntityName()
  }, [link])

  const handleUnlink = () => {
    unlinkMutation.mutate(note.id)
  }

  // Get link URL based on entity type
  const getLinkUrl = (link: NoteLink): string => {
    switch (link.entity_type) {
      case 'guest':
        return `/clients/${link.entity_id}`
      case 'appointment':
        return `/appointments/${link.entity_id}`
      case 'case':
        return `/cases/${link.entity_id}`
      default:
        return '#'
    }
  }

  return (
    <Row>
      {/* Main Content */}
      <Col md={8}>
        {/* Title Card */}
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <IconifyIcon icon="bx:notepad" className="me-2" />
              {getNoteDisplayTitle(note)}
            </h5>
            <small className="text-muted">
              Last updated: {format(new Date(note.updated_at), 'PPp')}
            </small>
          </Card.Header>
        </Card>

        {/* Content Card */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Content</h5>
          </Card.Header>
          <Card.Body>
            {note.content ? (
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {note.content}
              </p>
            ) : (
              <p className="text-muted mb-0">No content</p>
            )}
          </Card.Body>
        </Card>

        {/* Handwriting Section (Priority 3-A) */}
        {user?.id && (
          <HandwritingSection
            noteId={note.id}
            userId={user.id}
            readOnly={readOnly}
          />
        )}
        {/* Linked Entity Card */}
        {link && (
          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <IconifyIcon icon="bx:link" className="me-2" />
                Linked Entity
              </h5>
              {!readOnly && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleUnlink}
                  disabled={unlinkMutation.isPending}
                >
                  {unlinkMutation.isPending ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <IconifyIcon icon="bx:unlink" className="me-1" />
                      Unlink
                    </>
                  )}
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center gap-3">
                <Badge bg="secondary" className="text-capitalize">
                  {ENTITY_TYPE_LABELS[link.entity_type as NoteEntityType]}
                </Badge>
                {loadingEntity ? (
                  <Spinner animation="border" size="sm" />
                ) : linkedEntityName ? (
                  <Link to={getLinkUrl(link)} className="text-decoration-none">
                    {linkedEntityName}
                  </Link>
                ) : (
                  <span className="text-muted">Unknown entity</span>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>

      {/* Sidebar */}
      <Col md={4}>
        {/* Actions Card */}
        {!readOnly && (
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Actions</h5>
            </Card.Header>
            <Card.Body className="d-grid gap-2">
              <Link to={`/notes/${note.id}/edit`} className="btn btn-primary">
                <IconifyIcon icon="bx:edit" className="me-2" />
                Edit Note
              </Link>
              {onDelete && (
                <Button variant="outline-danger" onClick={onDelete}>
                  <IconifyIcon icon="bx:trash" className="me-2" />
                  Delete Note
                </Button>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Metadata Card */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Information</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-2">
              <small className="text-muted d-block">Created</small>
              <span>{format(new Date(note.created_at), 'PPp')}</span>
            </div>
            <div className="mb-0">
              <small className="text-muted d-block">Last Updated</small>
              <span>{format(new Date(note.updated_at), 'PPp')}</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

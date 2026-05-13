import { useState } from 'react'
import { Card, Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import EntityLinkSelector from './EntityLinkSelector'
import TiptapEditor from './TiptapEditor'
import type { NoteFormData, NoteEntityType, NoteContentFormat } from '../types'

type NoteFormProps = {
  initialData?: {
    title: string
    content: string
    contentFormat?: NoteContentFormat
    entityType?: NoteEntityType | null
    entityId?: string | null
  }
  onSubmit: (data: NoteFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  submitLabel?: string
}

function hasNonEmptyContent(content: string, format: NoteContentFormat): boolean {
  if (!content) return false
  if (format === 'plain') return content.trim().length > 0
  try {
    const doc = JSON.parse(content)
    const collectText = (node: unknown): string => {
      if (!node || typeof node !== 'object') return ''
      const n = node as { text?: string; content?: unknown[] }
      if (typeof n.text === 'string') return n.text
      if (Array.isArray(n.content)) return n.content.map(collectText).join('')
      return ''
    }
    return collectText(doc).trim().length > 0
  } catch {
    return false
  }
}

export default function NoteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Note',
}: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [contentFormat, setContentFormat] = useState<NoteContentFormat>(
    initialData?.contentFormat || 'plain'
  )
  const [entityType, setEntityType] = useState<NoteEntityType | null>(
    initialData?.entityType || null
  )
  const [entityId, setEntityId] = useState<string | null>(
    initialData?.entityId || null
  )

  const handleEditorChange = (newContent: string, newFormat: 'json') => {
    setContent(newContent)
    setContentFormat(newFormat)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: title.trim(),
      content: contentFormat === 'plain' ? content.trim() : content,
      contentFormat,
      entityType,
      entityId,
    })
  }

  const handleEntityChange = (type: NoteEntityType | null, id: string | null) => {
    setEntityType(type)
    setEntityId(id)
  }

  const contentValid = hasNonEmptyContent(content, contentFormat)

  return (
    <Form onSubmit={handleSubmit}>
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="bx:notepad" className="me-2" />
            Note Details
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title (Optional)</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this note..."
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Content <span className="text-danger">*</span></Form.Label>
            <TiptapEditor
              value={content}
              format={contentFormat}
              onChange={handleEditorChange}
              placeholder="Schrijf hier uw notitie..."
              disabled={isLoading}
            />
            <Form.Text className="text-muted">
              Rich text supported — bold, italic, headings, lists, blockquotes.
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Entity Link Section */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="bx:link" className="me-2" />
            Link to Entity (Optional)
          </h5>
        </Card.Header>
        <Card.Body>
          <EntityLinkSelector
            entityType={entityType}
            entityId={entityId}
            onChange={handleEntityChange}
            disabled={isLoading}
          />
        </Card.Body>
      </Card>

      {/* Form Actions */}
      <Row>
        <Col>
          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !contentValid}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <IconifyIcon icon="bx:save" className="me-2" />
                  {submitLabel}
                </>
              )}
            </Button>
            {onCancel ? (
              <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            ) : (
              <Link to="/notes" className="btn btn-secondary">
                Cancel
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  )
}

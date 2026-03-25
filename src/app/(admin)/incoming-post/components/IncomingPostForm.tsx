import { useState } from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import type { IncomingPostFormData, IncomingPostCategory, IncomingPostUrgency } from '../types'
import { CATEGORY_LABELS, URGENCY_LABELS } from '../constants'

type Props = {
  isSubmitting: boolean
  onSubmit: (data: IncomingPostFormData) => void
  onCancel: () => void
}

const categories: IncomingPostCategory[] = ['letter', 'memo', 'invitation', 'legal', 'report', 'other']
const urgencies: IncomingPostUrgency[] = ['normal', 'urgent', 'confidential']

export default function IncomingPostForm({ isSubmitting, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<IncomingPostFormData>({
    subject: '',
    sender_name: '',
    sender_organization: '',
    received_date: new Date().toISOString().split('T')[0],
    category: 'letter',
    urgency: 'normal',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.sender_name.trim()) return
    onSubmit(formData)
  }

  const update = (field: keyof IncomingPostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={formData.subject}
              onChange={(e) => update('subject', e.target.value)}
              placeholder="Enter subject"
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Received Date <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              value={formData.received_date}
              onChange={(e) => update('received_date', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Sender Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={formData.sender_name}
              onChange={(e) => update('sender_name', e.target.value)}
              placeholder="Enter sender name"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Sender Organization</Form.Label>
            <Form.Control
              type="text"
              value={formData.sender_organization}
              onChange={(e) => update('sender_organization', e.target.value)}
              placeholder="Enter organization (optional)"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={formData.category}
              onChange={(e) => update('category', e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Urgency</Form.Label>
            <Form.Select
              value={formData.urgency}
              onChange={(e) => update('urgency', e.target.value)}
            >
              {urgencies.map((u) => (
                <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Enter description (optional)"
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Post'}
        </Button>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </Form>
  )
}

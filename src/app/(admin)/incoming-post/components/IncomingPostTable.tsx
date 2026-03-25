import { Table, Spinner, Form, InputGroup, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import IncomingPostStatusBadge from './IncomingPostStatusBadge'
import IncomingPostUrgencyBadge from './IncomingPostUrgencyBadge'
import { formatDate, STATUS_FILTER_OPTIONS, CATEGORY_FILTER_OPTIONS, URGENCY_FILTER_OPTIONS, CATEGORY_LABELS } from '../constants'
import type { IncomingPost, IncomingPostStatus, IncomingPostCategory, IncomingPostUrgency } from '../types'

type Props = {
  posts: IncomingPost[]
  isLoading: boolean
}

export default function IncomingPostTable({ posts, isLoading }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<IncomingPostStatus | ''>('')
  const [categoryFilter, setCategoryFilter] = useState<IncomingPostCategory | ''>('')
  const [urgencyFilter, setUrgencyFilter] = useState<IncomingPostUrgency | ''>('')

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false
      if (categoryFilter && p.category !== categoryFilter) return false
      if (urgencyFilter && p.urgency !== urgencyFilter) return false
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        return (
          p.reference_number.toLowerCase().includes(term) ||
          p.subject.toLowerCase().includes(term) ||
          p.sender_name.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [posts, searchTerm, statusFilter, categoryFilter, urgencyFilter])

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading incoming post...</p>
      </div>
    )
  }

  return (
    <>
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><IconifyIcon icon="bx:search" /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by reference, subject, sender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                <IconifyIcon icon="bx:x" />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as IncomingPostStatus | '')}>
            {STATUS_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as IncomingPostCategory | '')}>
            {CATEGORY_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value as IncomingPostUrgency | '')}>
            {URGENCY_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Form.Select>
        </Col>
      </Row>

      <div className="mb-2 text-muted small">
        Showing {filtered.length} of {posts.length} items
      </div>

      <div className="table-responsive">
        <Table className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Reference</th>
              <th>Subject</th>
              <th>Sender</th>
              <th>Category</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Received</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  {searchTerm || statusFilter || categoryFilter || urgencyFilter
                    ? 'No items found matching your filters'
                    : 'No incoming post items yet'}
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/incoming-post/${post.id}`} className="text-body fw-medium font-monospace">
                      {post.reference_number}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/incoming-post/${post.id}`} className="text-body">
                      {post.subject}
                    </Link>
                  </td>
                  <td>{post.sender_name}</td>
                  <td>{CATEGORY_LABELS[post.category]}</td>
                  <td><IncomingPostUrgencyBadge urgency={post.urgency} /></td>
                  <td><IncomingPostStatusBadge status={post.status} /></td>
                  <td>{formatDate(post.received_date)}</td>
                  <td className="text-end">
                    <Link to={`/incoming-post/${post.id}`} className="btn btn-sm btn-soft-primary" title="View">
                      <IconifyIcon icon="bx:show" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

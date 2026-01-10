import { useState } from 'react'
import { Row, Col, Form, Button, Card, CardBody } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { AuditLogFilters, AuditAction } from '../types'
import { ACTION_OPTIONS, ENTITY_TYPE_OPTIONS } from '../constants'

interface AuditLogFiltersProps {
  filters: AuditLogFilters
  onFiltersChange: (filters: AuditLogFilters) => void
  onReset: () => void
}

export function AuditLogFiltersComponent({ filters, onFiltersChange, onReset }: AuditLogFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  )

  const handleStartDateChange = (dates: Date[]) => {
    setStartDate(dates[0])
    onFiltersChange({
      ...filters,
      startDate: dates[0] ? dates[0].toISOString() : null,
    })
  }

  const handleEndDateChange = (dates: Date[]) => {
    setEndDate(dates[0])
    onFiltersChange({
      ...filters,
      endDate: dates[0] ? dates[0].toISOString() : null,
    })
  }

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AuditAction | ''
    onFiltersChange({
      ...filters,
      action: value || null,
    })
  }

  const handleEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      entityType: e.target.value || null,
    })
  }

  const handleReset = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    onReset()
  }

  return (
    <Card className="mb-3">
      <CardBody>
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Flatpickr
                className="form-control"
                placeholder="Start date"
                value={startDate}
                options={{ dateFormat: 'Y-m-d' }}
                onChange={handleStartDateChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Flatpickr
                className="form-control"
                placeholder="End date"
                value={endDate}
                options={{ dateFormat: 'Y-m-d' }}
                onChange={handleEndDateChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Action</Form.Label>
              <Form.Select
                value={filters.action || ''}
                onChange={handleActionChange}
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Entity Type</Form.Label>
              <Form.Select
                value={filters.entityType || ''}
                onChange={handleEntityTypeChange}
              >
                {ENTITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="outline-secondary" onClick={handleReset} className="w-100">
              <IconifyIcon icon="bx:reset" className="me-1" />
              Reset
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

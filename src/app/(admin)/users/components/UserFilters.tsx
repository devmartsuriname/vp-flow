import { Row, Col, Form } from 'react-bootstrap'
import { STATUS_OPTIONS } from '../constants'
import type { UserFilters } from '../types'

interface UserFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

/**
 * User list filters: search and status
 */
export const UserFiltersComponent = ({ filters, onFiltersChange }: UserFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as UserFilters['status'],
    })
  }

  return (
    <Row className="mb-3 g-2">
      <Col md={6} lg={4}>
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </Col>
      <Col md={4} lg={3}>
        <Form.Select value={filters.status} onChange={handleStatusChange}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  )
}

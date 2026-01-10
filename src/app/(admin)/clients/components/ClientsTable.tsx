import { Table, Badge, Button, Spinner, Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { Client } from '../types'
import { getClientDisplayName } from '../types'
import { useState, useMemo } from 'react'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

type ClientsTableProps = {
  clients: Client[]
  isLoading: boolean
  userRole: VPFlowRole | null
  onDelete?: (client: Client) => void
}

export default function ClientsTable({ 
  clients, 
  isLoading, 
  userRole,
  onDelete 
}: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients

    const term = searchTerm.toLowerCase()
    return clients.filter((client) => {
      const displayName = getClientDisplayName(client).toLowerCase()
      const email = client.email?.toLowerCase() || ''
      const phone = client.phone || ''
      return (
        displayName.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      )
    })
  }, [clients, searchTerm])

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading clients...</p>
      </div>
    )
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <IconifyIcon icon="bx:search" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearchTerm('')}
            >
              <IconifyIcon icon="bx:x" />
            </Button>
          )}
        </InputGroup>
      </div>

      {/* Results count */}
      <div className="mb-2 text-muted small">
        Showing {filteredClients.length} of {clients.length} clients
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  {searchTerm ? 'No clients found matching your search' : 'No clients yet'}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link 
                      to={`/clients/${client.id}`} 
                      className="text-body fw-medium"
                    >
                      {getClientDisplayName(client)}
                    </Link>
                  </td>
                  <td>
                    <Badge 
                      bg={client.client_type === 'organization' ? 'info' : 'secondary'}
                      className="text-capitalize"
                    >
                      {client.client_type}
                    </Badge>
                  </td>
                  <td>{client.email || '—'}</td>
                  <td>{client.phone || '—'}</td>
                  <td>{client.district || '—'}</td>
                  <td className="text-end">
                    <Link 
                      to={`/clients/${client.id}`}
                      className="btn btn-sm btn-soft-primary me-1"
                      title="View"
                    >
                      <IconifyIcon icon="bx:show" />
                    </Link>
                    <Link 
                      to={`/clients/${client.id}/edit`}
                      className="btn btn-sm btn-soft-info me-1"
                      title="Edit"
                    >
                      <IconifyIcon icon="bx:edit" />
                    </Link>
                    {isVP(userRole) && onDelete && (
                      <Button
                        variant="soft-danger"
                        size="sm"
                        title="Delete"
                        onClick={() => onDelete(client)}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
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

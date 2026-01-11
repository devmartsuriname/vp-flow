import { Card, CardHeader, CardBody, Table, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useRecentClients } from '../hooks'
import EmptyState from './EmptyState'

const RecentClients = () => {
  const { data: clients, isLoading, error } = useRecentClients(5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Recent Clients</h5>
        </CardHeader>
        <CardBody className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Clients"
        message="Unable to fetch recent clients."
        icon="bx:error-circle"
      />
    )
  }

  if (!clients || clients.length === 0) {
    return (
      <EmptyState
        title="No Clients"
        message="No clients have been registered yet."
        icon="bx:group"
      />
    )
  }

  const getClientName = (client: typeof clients[0]) => {
    if (client.client_type === 'organization') {
      return client.organization_name || 'Unknown Organization'
    }
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown'
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Recent Clients</h5>
        <Link to="/clients" className="btn btn-sm btn-soft-primary">
          View All
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive className="table-centered mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>District</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                    {getClientName(client)}
                  </span>
                </td>
                <td className="text-capitalize">{client.client_type}</td>
                <td>{client.district || '—'}</td>
                <td className="text-nowrap">
                  {format(new Date(client.created_at), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default RecentClients

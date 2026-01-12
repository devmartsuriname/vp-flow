import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClients, useDeleteClient } from './hooks'
import { ClientsTable, DeleteClientModal } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { Client } from './types'

const ClientsPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: clients = [], isLoading, error } = useClients()
  const deleteClient = useDeleteClient()

  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  // Safe redirect in useEffect (not during render)
  useEffect(() => {
    if (!authLoading && (isProtocol(role) || !isVPOrSecretary(role))) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  // Return null after redirect is scheduled
  if (!authLoading && (isProtocol(role) || !isVPOrSecretary(role))) {
    return null
  }

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client)
  }

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient.mutate(clientToDelete.id, {
        onSuccess: () => {
          setClientToDelete(null)
        },
      })
    }
  }

  const handleDeleteCancel = () => {
    setClientToDelete(null)
  }

  if (error) {
    return (
      <>
        <PageTitle subName="VP-Flow" title="Clients" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Clients</h5>
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
      <PageTitle subName="VP-Flow" title="Clients" />

      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Client Registry</h5>
              <p className="text-muted mb-0">Manage internal clients and contacts</p>
            </div>
            <Link to="/clients/create" className="btn btn-primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Client
            </Link>
          </div>
        </Col>
      </Row>

      <Card>
        <CardBody>
          <ClientsTable
            clients={clients}
            isLoading={isLoading}
            userRole={role}
            onDelete={handleDeleteClick}
          />
        </CardBody>
      </Card>

      <DeleteClientModal
        show={!!clientToDelete}
        client={clientToDelete}
        isDeleting={deleteClient.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default ClientsPage

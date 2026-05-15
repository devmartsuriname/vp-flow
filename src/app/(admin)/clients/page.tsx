import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Row, Col, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClientsPaginated, useDeleteClient, CLIENTS_PAGE_SIZE } from './hooks'
import { ClientsTable, DeleteClientModal } from './components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { Client } from './types'

const ClientsPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useClientsPaginated(page)
  const deleteClient = useDeleteClient()

  const clients = data?.rows ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / CLIENTS_PAGE_SIZE))

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
        <PageTitle subName="VP-Flow" title="Guests" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Error Loading Guests</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const from = totalCount === 0 ? 0 : (page - 1) * CLIENTS_PAGE_SIZE + 1
  const to = Math.min(page * CLIENTS_PAGE_SIZE, totalCount)

  return (
    <>
      <PageTitle subName="VP-Flow" title="Guests" />

      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Guest Registry</h5>
              <p className="text-muted mb-0">Manage internal guests and contacts</p>
            </div>
            <Link to="/clients/create" className="btn btn-primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Guest
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
        {totalCount > 0 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <small className="text-muted">Showing {from}–{to} of {totalCount}</small>
            {totalPages > 1 && (
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Page {page} of {totalPages}</small>
                <Pagination className="mb-0">
                  <Pagination.Prev
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                  <Pagination.Next
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </Pagination>
              </div>
            )}
          </div>
        )}
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

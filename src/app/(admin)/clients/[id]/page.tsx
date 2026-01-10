import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClient, useDeleteClient } from '../hooks'
import { ClientDetail, DeleteClientModal } from '../components'
import { useUserRole, isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: client, isLoading, error } = useClient(id)
  const deleteClient = useDeleteClient()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Redirect Protocol users (no access)
  if (!isRoleLoading && isProtocol(role)) {
    navigate('/dashboards')
    return null
  }

  // Check for VP/Secretary access
  if (!isRoleLoading && !isVPOrSecretary(role)) {
    navigate('/dashboards')
    return null
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (client) {
      deleteClient.mutate(client.id, {
        onSuccess: () => {
          navigate('/clients')
        },
      })
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  if (isLoading || isRoleLoading) {
    return (
      <>
        <PageTitle subName="Clients" title="Client Details" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading client...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (error || !client) {
    return (
      <>
        <PageTitle subName="Clients" title="Client Not Found" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Client Not Found</h5>
            <p className="text-muted">
              {error?.message || 'The client you are looking for does not exist.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/clients')}>
              Back to Clients
            </Button>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle subName="Clients" title="Client Details" />

      <ClientDetail
        client={client}
        userRole={role}
        onDelete={handleDeleteClick}
      />

      <DeleteClientModal
        show={showDeleteModal}
        client={client}
        isDeleting={deleteClient.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default ClientDetailPage

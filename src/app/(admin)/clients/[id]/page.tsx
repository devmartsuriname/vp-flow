import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClient, useDeleteClient } from '../hooks'
import { ClientDetail, DeleteClientModal } from '../components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: client, isLoading, error } = useClient(id)
  const deleteClient = useDeleteClient()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  if (isLoading) {
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
        clientId={client.id}
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

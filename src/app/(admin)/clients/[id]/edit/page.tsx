import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useClient, useUpdateClient } from '../../hooks'
import { ClientForm } from '../../components'
import { useUserRole, isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { ClientFormData } from '../../types'

const EditClientPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: client, isLoading, error } = useClient(id)
  const updateClient = useUpdateClient()

  // Safe redirect in useEffect (not during render)
  useEffect(() => {
    if (!isRoleLoading && (isProtocol(role) || !isVPOrSecretary(role))) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, isRoleLoading, navigate])

  // Return null after redirect is scheduled
  if (isProtocol(role) || !isVPOrSecretary(role)) {
    return null
  }

  const handleSubmit = (formData: ClientFormData) => {
    if (!id) return

    updateClient.mutate(
      { id, formData },
      {
        onSuccess: () => {
          navigate(`/clients/${id}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/clients/${id}`)
  }

  if (isLoading || isRoleLoading) {
    return (
      <>
        <PageTitle subName="Clients" title="Edit Client" />
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
      <PageTitle subName="Clients" title="Edit Client" />

      <Card>
        <CardBody>
          <ClientForm
            initialData={client}
            isSubmitting={updateClient.isPending}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default EditClientPage

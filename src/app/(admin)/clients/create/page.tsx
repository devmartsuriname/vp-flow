import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { ClientForm } from '../components'
import { useCreateClient } from '../hooks'
import { useUserRole, isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { ClientFormData } from '../types'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const createClient = useCreateClient()

  // Role-based access control - redirect unauthorized users
  useEffect(() => {
    if (!isRoleLoading) {
      if (isProtocol(role) || !isVPOrSecretary(role)) {
        navigate('/dashboards', { replace: true })
      }
    }
  }, [role, isRoleLoading, navigate])

  // Show loading while role is being checked
  if (isRoleLoading) {
    return (
      <>
        <PageTitle subName="Clients" title="Create Client" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Checking access...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  // Block render for unauthorized roles
  if (!isVPOrSecretary(role)) {
    return null
  }

  const handleSubmit = (formData: ClientFormData) => {
    createClient.mutate(formData, {
      onSuccess: (data) => {
        navigate(`/clients/${data.id}`)
      },
    })
  }

  const handleCancel = () => {
    navigate('/clients')
  }

  return (
    <>
      <PageTitle subName="Clients" title="Create Client" />

      <Card>
        <CardBody>
          <ClientForm
            isSubmitting={createClient.isPending}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default CreateClientPage

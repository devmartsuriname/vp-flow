import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { ClientForm } from '../components'
import { useCreateClient } from '../hooks'
import { useUserRole, isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { ClientFormData } from '../types'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const createClient = useCreateClient()

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

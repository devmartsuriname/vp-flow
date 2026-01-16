import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { ClientForm } from '../components'
import { useCreateClient } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { ClientFormData } from '../types'

const CreateClientPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const createClient = useCreateClient()

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
      <PageTitle subName="Guests" title="Create Guest" />

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

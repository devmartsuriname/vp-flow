import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { AppointmentForm } from '../components'
import { useCreateAppointment } from '../hooks'
import { useUserRole, isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { AppointmentFormData } from '../types'

const CreateAppointmentPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const createAppointment = useCreateAppointment()

  useEffect(() => {
    if (!isRoleLoading && (isProtocol(role) || !isVPOrSecretary(role))) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, isRoleLoading, navigate])

  if (isRoleLoading) {
    return (
      <>
        <PageTitle subName="Appointments" title="Create Appointment" />
        <Card><CardBody className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">Loading...</p></CardBody></Card>
      </>
    )
  }

  if (isProtocol(role) || !isVPOrSecretary(role)) return null

  const handleSubmit = (formData: AppointmentFormData) => {
    createAppointment.mutate(formData, { onSuccess: (data) => navigate(`/appointments/${data.id}`) })
  }

  return (
    <>
      <PageTitle subName="Appointments" title="Create Appointment" />
      <Card><CardBody><AppointmentForm userRole={role} isSubmitting={createAppointment.isPending} onSubmit={handleSubmit} onCancel={() => navigate('/appointments')} /></CardBody></Card>
    </>
  )
}

export default CreateAppointmentPage
